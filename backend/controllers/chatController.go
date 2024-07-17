package controllers

import (
	"context"
	"log"
	"sync"
	"time"
	"net/http"
	"github.com/gorilla/websocket"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"github.com/Somraj2929/lightweight-project-tracker/db"
	"github.com/Somraj2929/lightweight-project-tracker/models"
	"github.com/Somraj2929/lightweight-project-tracker/utils"
	"go.mongodb.org/mongo-driver/mongo/options"
	
)


var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Client struct {
	Conn *websocket.Conn
	Pool *ChatPool
}

func (cp *ChatPool) addClient(client *Client) {
	cp.mu.Lock()
	defer cp.mu.Unlock()
	cp.clients[client] = true
	log.Println("Client added to chat pool:", cp.chatID)
}

func (cp *ChatPool) removeClient(client *Client) {
	cp.mu.Lock()
	defer cp.mu.Unlock()
	delete(cp.clients, client)
	client.Conn.Close()
	log.Println("Client removed from chat pool:", cp.chatID)
}

func (cp *ChatPool) broadcastMessage(message models.Message) {
	cp.mu.Lock()
	defer cp.mu.Unlock()
	for client := range cp.clients {
		if err := client.Conn.WriteJSON(message); err != nil {
			cp.removeClient(client)
		}
	}
}

func ServeWebSocket(c *gin.Context) {
	chatID := c.Query("chatID")
	log.Println("Received WebSocket connection request for chatID:", chatID)

	pool, ok := chatManager.chatPools[chatID]
	if !ok {
		log.Println("Chat room not found for chatID:", chatID)
		c.JSON(http.StatusNotFound, gin.H{"error": "Chat room not found"})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("Failed to upgrade to WebSocket:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upgrade to WebSocket"})
		return
	}
	log.Println("WebSocket upgrade successful for chatID:", chatID)

	client := &Client{Conn: conn, Pool: pool}
	pool.addClient(client)
	log.Println("Client added to chat pool:", chatID)

	go func() {
		defer pool.removeClient(client)
		for {
			var msg models.Message
			if err := conn.ReadJSON(&msg); err != nil {
				log.Println("Error reading message:", err)
				break
			}
			msg.Timestamp = time.Now()
			pool.messageCh <- msg
		}
		log.Println("Client disconnected from chat pool:", chatID)
	}()
}


type ChatManager struct {
	mu       sync.Mutex
	chatPools map[string]*ChatPool
}

type ChatPool struct {
	chatID    string
	messages  []models.Message
	messageCh chan models.Message
	closeCh   chan bool
	clients   map[*Client]bool
	mu        sync.Mutex
}

var chatManager = &ChatManager{
	chatPools: make(map[string]*ChatPool),
}

func (cm *ChatManager) StartChatPool(chatID string) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	pool := &ChatPool{
		chatID:    chatID,
		messages:  []models.Message{},
		messageCh: make(chan models.Message),
		closeCh:   make(chan bool),
		clients:   make(map[*Client]bool),
	}

	cm.chatPools[chatID] = pool

	go pool.run()
}

func (cp *ChatPool) run() {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case msg := <-cp.messageCh:
			cp.messages = append(cp.messages, msg)
			cp.broadcastMessage(msg)
		case <-ticker.C:
			cp.saveMessages()
		case <-cp.closeCh:
			cp.saveMessages()
			return
		}
	}
}

func (cp *ChatPool) saveMessages() {
	if len(cp.messages) == 0 {
		return
	}

	collection := db.MongoClient.Database("project_tracker").Collection("chats")

	var chat models.Chat
	err := collection.FindOneAndUpdate(
		context.TODO(),
		bson.M{"_id": cp.chatID},
		bson.M{"$inc": bson.M{"messageCounter": int64(len(cp.messages))}},
		options.FindOneAndUpdate().SetReturnDocument(options.After),
	).Decode(&chat)
	if err != nil {
		log.Printf("Failed to update message counter: %v", err)
		return
	}

	for i := range cp.messages {
		cp.messages[i].ID = chat.MessageCounter - int(len(cp.messages)) + int(i) + 1
	}

	_, err = collection.UpdateOne(
		context.TODO(),
		bson.M{"_id": cp.chatID},
		bson.M{"$push": bson.M{"messages": bson.M{"$each": cp.messages}}},
	)
	if err != nil {
		log.Printf("Failed to save messages: %v", err)
		return
	}

	cp.messages = []models.Message{}
}

func CreateChatRoom(c *gin.Context) {
	var chatRoom models.Chat
	if err := c.BindJSON(&chatRoom); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	chatID, err := utils.GenerateChatID()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate chat ID"})
		return
	}

	chatRoom.ID = chatID
	chatRoom.CreatedAt = time.Now()
	chatRoom.MessageCounter = 0
	chatRoom.Status = "open"

	defaultMessage := models.Message{
		Text:      "Chat's ON! Let's get talking!",
		Timestamp: time.Now(),
		UserID:    0,
	}

	chatRoom.Messages = append(chatRoom.Messages, defaultMessage)

	collection := db.MongoClient.Database("project_tracker").Collection("chats")
	_, err = collection.InsertOne(c, chatRoom)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	chatManager.StartChatPool(chatRoom.ID)

	c.JSON(http.StatusOK, gin.H{"chatID": chatRoom.ID})
}

func SendMessage(c *gin.Context) {
	chatID := c.Param("id")
	var message models.Message
	if err := c.BindJSON(&message); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	message.Timestamp = time.Now()

	chatManager.mu.Lock()
	pool, exists := chatManager.chatPools[chatID]
	chatManager.mu.Unlock()

	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Chat pool not found"})
		return
	}

	pool.messageCh <- message

	c.JSON(http.StatusOK, gin.H{"message": "Message sent successfully"})
}

func CloseChatRoom(c *gin.Context) {
	chatID := c.Param("id")

	chatManager.mu.Lock()
	pool, exists := chatManager.chatPools[chatID]
	if exists {
		pool.closeCh <- true
		delete(chatManager.chatPools, chatID)
	}
	chatManager.mu.Unlock()

	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Chat pool not found"})
		return
	}

	collection := db.MongoClient.Database("project_tracker").Collection("chats")
	_, err := collection.UpdateOne(
		context.TODO(),
		bson.M{"_id": chatID},
		bson.M{"$set": bson.M{"status": "closed"}},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Chat room closed successfully"})
}

func GetChatDetails(c *gin.Context) {
	chatID := c.Param("id")

	var chat models.Chat
	collection := db.MongoClient.Database("project_tracker").Collection("chats")
	err := collection.FindOne(c, bson.M{"_id": chatID}).Decode(&chat)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	chatManager.mu.Lock()
	pool, exists := chatManager.chatPools[chatID]
	if exists {
		chat.Messages = append(chat.Messages, pool.messages...)
	}
	chatManager.mu.Unlock()

	c.JSON(http.StatusOK, chat)
}

func (cm *ChatManager) ResumeChatPool(chatID string) error {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	if _, exists := cm.chatPools[chatID]; exists {
		return nil
	}

	var chat models.Chat
	collection := db.MongoClient.Database("project_tracker").Collection("chats")
	err := collection.FindOne(context.TODO(), bson.M{"_id": chatID, "status": "open"}).Decode(&chat)
	if err != nil {
		return err
	}

	pool := &ChatPool{
		chatID:    chatID,
		messages:  chat.Messages,
		messageCh: make(chan models.Message),
		closeCh:   make(chan bool),
		clients:   make(map[*Client]bool),
	}

	cm.chatPools[chatID] = pool

	go pool.run()

	return nil
}

func JoinChatRoom(c *gin.Context) {
	chatID := c.Param("id")

	var chat models.Chat
	collection := db.MongoClient.Database("project_tracker").Collection("chats")
	err := collection.FindOne(context.TODO(), bson.M{"_id": chatID}).Decode(&chat)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Chat room not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch chat room"})
		return
	}

	if chat.Status == "closed" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Chat room is closed"})
		return
	}

	err = chatManager.ResumeChatPool(chatID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to join chat room"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Joined chat room successfully"})
}
