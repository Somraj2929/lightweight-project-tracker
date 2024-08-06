package controllers

import (
	"log"
	"net/http"
	"strconv"
	"time"
	"crypto/rand"
	 mathRand "math/rand"
	"encoding/base64"
	"context"
	

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"

	"github.com/Somraj2929/lightweight-project-tracker/db"
	"github.com/Somraj2929/lightweight-project-tracker/models"
	"github.com/Somraj2929/lightweight-project-tracker/utils"
	"go.mongodb.org/mongo-driver/mongo"
)

func Signup(c *gin.Context) {
	var user models.User
	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user already exists with the given email
	collection := db.MongoClient.Database("project_tracker").Collection("users")
	var existingUser models.User
	err := collection.FindOne(c, bson.M{"email": user.Email}).Decode(&existingUser)
	if err == nil {
		// User already exists
		c.JSON(http.StatusConflict, gin.H{"error": "User with this email already exists"})
		return
	} else if err != mongo.ErrNoDocuments {
		// An error occurred while trying to find the user
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check if user exists"})
		return
	}

	// Generate user ID
	userID, err := models.GetNextUserID()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate user ID"})
		return
	}
	user.ID = userID

	// Hash the password
	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	user.Password = hashedPassword

	// Array of avatar links
	avatars := []string{
		"https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
		"https://d2u8k2ocievbld.cloudfront.net/memojis/male/2.png",
		"https://d2u8k2ocievbld.cloudfront.net/memojis/male/3.png",
		"https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png",
		"https://d2u8k2ocievbld.cloudfront.net/memojis/female/2.png",
		"https://d2u8k2ocievbld.cloudfront.net/memojis/female/3.png",
		"https://d2u8k2ocievbld.cloudfront.net/memojis/male/4.png",
		"https://d2u8k2ocievbld.cloudfront.net/memojis/male/5.png",
		"https://d2u8k2ocievbld.cloudfront.net/memojis/male/6.png",
		"https://d2u8k2ocievbld.cloudfront.net/memojis/male/7.png",
		"https://d2u8k2ocievbld.cloudfront.net/memojis/male/8.png",
		"https://d2u8k2ocievbld.cloudfront.net/memojis/male/9.png",
		"https://d2u8k2ocievbld.cloudfront.net/memojis/male/10.png",
		"https://d2u8k2ocievbld.cloudfront.net/memojis/female/4.png",
		"https://d2u8k2ocievbld.cloudfront.net/memojis/female/5.png",
		"https://d2u8k2ocievbld.cloudfront.net/memojis/female/6.png",
		"https://d2u8k2ocievbld.cloudfront.net/memojis/female/7.png",
		"https://d2u8k2ocievbld.cloudfront.net/memojis/female/8.png",
		"https://d2u8k2ocievbld.cloudfront.net/memojis/female/9.png",
		"https://d2u8k2ocievbld.cloudfront.net/memojis/female/10.png",
	}

	// Seed the random number generator and select a random avatar
	source := mathRand.NewSource(time.Now().UnixNano())
	r := mathRand.New(source)
	randomIndex := r.Intn(len(avatars))
	user.Avatar = avatars[randomIndex]

	// Set created and updated timestamps
	now := time.Now()
	user.CreatedAt = now
	user.UpdatedAt = now

	// Insert user into database
	_, err = collection.InsertOne(c, user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// Generate JWT token
	userIDStr := strconv.Itoa(user.ID)
	token, err := utils.GenerateJWT(userIDStr, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token, "userId": user.ID})
}


func Login(c *gin.Context) {
	var loginData struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.BindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Fatalln("No Credentials Provided")
		return
	}

	var user models.User
	collection := db.MongoClient.Database("project_tracker").Collection("users")
	err := collection.FindOne(c, bson.M{"email": loginData.Email}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Check password hash
	if !utils.CheckPasswordHash(loginData.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	userID := strconv.Itoa(user.ID)

	// Generate JWT token
	token, err := utils.GenerateJWT(userID, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

func generateToken() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

func RequestPasswordReset(c *gin.Context) {
	var request struct {
		Email string `json:"email" binding:"required,email"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := db.MongoClient.Database("project_tracker").Collection("password_reset_requests")
	now := time.Now()

	// Check if there are already 3 requests in the last 24 hours
	count, err := collection.CountDocuments(context.TODO(), bson.M{
		"email": request.Email,
		"timestamp": bson.M{
			"$gte": now.Add(-24 * time.Hour),
		},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check reset requests"})
		return
	}

	if count >= 3 {
		c.JSON(http.StatusTooManyRequests, gin.H{"error": "Too many password reset requests. Please try again later"})
		return
	}

	// Proceed with password reset process
	var user models.User
	userCollection := db.MongoClient.Database("project_tracker").Collection("users")
	err = userCollection.FindOne(c, bson.M{"email": request.Email}).Decode(&user)
	if err == mongo.ErrNoDocuments {
		log.Println("User not found with email:", request.Email)
		c.JSON(http.StatusOK, gin.H{"message": "If the email exists, a reset link has been sent"})
		return
	} else if err != nil {
		log.Println("Error occurred while finding user:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "An error occurred while processing the request"})
		return
	}

	// Log user details
	//log.Printf("User found: %+v\n", user.ToCheckIn())

	token, err := generateToken()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	resetToken := models.PasswordResetToken{
		Token:     token,
		UserID:    user.ID,
		ExpiresAt: time.Now().Add(1 * time.Hour),
	}
	_, err = db.MongoClient.Database("project_tracker").Collection("reset_tokens").InsertOne(c, resetToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store token"})
		return
	}

	utils.SendPasswordResetEmail(user.Email, token)

	// Log the password reset request
	resetRequest := models.PasswordResetRequest{
		Email:     user.Email,
		Timestamp: now,
	}
	_, err = collection.InsertOne(context.TODO(), resetRequest)
	if err != nil {
		log.Println("Failed to log password reset request:", err)
	}

	c.JSON(http.StatusOK, gin.H{"message": "If the email exists, a reset link has been sent"})
}

func ResetPassword(c *gin.Context) {
	var request struct {
		Token    string `json:"token" binding:"required"`
		Password string `json:"password" binding:"required,min=8"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var resetToken models.PasswordResetToken
	err := db.MongoClient.Database("project_tracker").Collection("reset_tokens").FindOne(c, bson.M{"token": request.Token}).Decode(&resetToken)
	if err == mongo.ErrNoDocuments || time.Now().After(resetToken.ExpiresAt) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or expired token"})
		return
	}

	var user models.User
	err = db.MongoClient.Database("project_tracker").Collection("users").FindOne(c, bson.M{"_id": resetToken.UserID}).Decode(&user)
	if err == mongo.ErrNoDocuments {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User not found"})
		return
	}

	updatedPassword, err := utils.HashPassword(request.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	_, err = db.MongoClient.Database("project_tracker").Collection("users").UpdateOne(c, bson.M{"_id": user.ID}, bson.M{"$set": bson.M{"password": updatedPassword}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	db.MongoClient.Database("project_tracker").Collection("reset_tokens").DeleteOne(c, bson.M{"_id": resetToken.ID})
	c.JSON(http.StatusOK, gin.H{"message": "Password reset successful"})
}
