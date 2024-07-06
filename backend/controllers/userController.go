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

    c.JSON(http.StatusOK, user)
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
