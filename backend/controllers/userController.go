package controllers

import (
	"net/http"
	"time"
	"strconv"

	"github.com/Somraj2929/lightweight-project-tracker/db"
	"github.com/Somraj2929/lightweight-project-tracker/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	
)

type UserResponse struct {
    ID        int    `json:"id"`
    Name      string `json:"name"`
    Email     string `json:"email"`
    Team      string `json:"team"`
    Role      string `json:"role"`
    Avatar    string `json:"avatar"`
    CreatedAt string `json:"createdAt"`
    UpdatedAt string `json:"updatedAt"`
}

func GetUserDetails(c *gin.Context) {
    userID := c.Param("id")
	objID, err := strconv.Atoi(userID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
        return
    }

    var user models.User
    collection := db.MongoClient.Database("project_tracker").Collection("users")
    err = collection.FindOne(c, bson.M{"_id": objID}).Decode(&user)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    userResponse := UserResponse{
        ID:        user.ID,
        Name:      user.Name,
        Email:     user.Email,
        Team:      user.Team,
        Role:      user.Role,
        Avatar:    user.Avatar,
        CreatedAt: user.CreatedAt.Format(time.RFC3339), // Format the time to RFC3339 (ISO8601 format
        UpdatedAt: user.UpdatedAt.Format(time.RFC3339),
    }

    c.JSON(http.StatusOK, userResponse)
    
}

func GetAllUsers(c *gin.Context) {
    var users []models.User
    collection := db.MongoClient.Database("project_tracker").Collection("users")
    cursor, err := collection.Find(c, bson.M{})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer cursor.Close(c)

    if err = cursor.All(c, &users); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    var usersResponse []UserResponse
    for _, user := range users {
        userResponse := UserResponse{
            ID:        user.ID,
            Name:      user.Name,
            Email:     user.Email,
            Team:      user.Team,
            Role:      user.Role,
            Avatar:    user.Avatar,
            CreatedAt: user.CreatedAt.Format(time.RFC3339),
            UpdatedAt: user.UpdatedAt.Format(time.RFC3339),
        }
        usersResponse = append(usersResponse, userResponse)
    }
    c.JSON(http.StatusOK, usersResponse)
}

func UpdateUserDetails(c *gin.Context) {
    userID := c.Param("id")
    objID, err := strconv.Atoi(userID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
        return
    }

    var updateData struct {
        Name string `json:"name"`
        Team string `json:"team"`
        Role string `json:"role"`
    }
    if err := c.BindJSON(&updateData); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    collection := db.MongoClient.Database("project_tracker").Collection("users")
    _, err = collection.UpdateOne(c, bson.M{"_id": objID}, bson.M{"$set": bson.M{"name": updateData.Name, "team": updateData.Team, "role": updateData.Role, "updatedAt": time.Now()}})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "User details updated successfully"})
}

func UpdateUserAvatar(c *gin.Context) {
    userID := c.Param("id")
    objID, err := strconv.Atoi(userID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
        return
    }

    var updateData struct {
        Avatar string `json:"avatar"`
    }
    if err := c.BindJSON(&updateData); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    collection := db.MongoClient.Database("project_tracker").Collection("users")
    _, err = collection.UpdateOne(c, bson.M{"_id": objID}, bson.M{"$set": bson.M{"avatar": updateData.Avatar, "updatedAt": time.Now()}})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Avatar updated successfully"})
}
