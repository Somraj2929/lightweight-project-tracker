package controllers

import (
	"net/http"
	"time"

	"github.com/Somraj2929/lightweight-project-tracker/db"
	"github.com/Somraj2929/lightweight-project-tracker/models"
	"github.com/Somraj2929/lightweight-project-tracker/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

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
	chatRoom.MessageCounter = 0 // Initialize message counter and set to 1 for the first message

	// Add default message
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

	collection := db.MongoClient.Database("project_tracker").Collection("chats")

	// Find the chat and increment the message counter
	var chat models.Chat
	err := collection.FindOneAndUpdate(
		c,
		bson.M{"_id": chatID},
		bson.M{"$inc": bson.M{"messageCounter": 1}},
		options.FindOneAndUpdate().SetReturnDocument(options.After),
	).Decode(&chat)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Assign the new message ID
	message.ID = chat.MessageCounter

	// Update the chat with the new message
	_, err = collection.UpdateOne(
		c,
		bson.M{"_id": chatID},
		bson.M{"$push": bson.M{"messages": message}},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Message sent successfully"})
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

	c.JSON(http.StatusOK, chat)
}
