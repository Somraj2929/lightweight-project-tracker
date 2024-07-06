package controllers

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"

	"github.com/Somraj2929/lightweight-project-tracker/db"
	"github.com/Somraj2929/lightweight-project-tracker/models"
	"github.com/Somraj2929/lightweight-project-tracker/utils"
	"go.mongodb.org/mongo-driver/mongo"
)

// func Signup(c *gin.Context) {
//     var user models.User
//     if err := c.BindJSON(&user); err != nil {
//         c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
//         return
//     }

//     hashedPassword, err := utils.HashPassword(user.Password)
//     if err != nil {
//         c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})

//         return
//     }
//     user.Password = hashedPassword
//     user.CreatedAt = time.Now()
//     user.UpdatedAt = time.Now()
//     user.Avatar = "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png"

//     collection := db.MongoClient.Database("project_tracker").Collection("users")
//     result, err := collection.InsertOne(c, user)
//     if err != nil {
//         c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
//         return
//     }

//     c.JSON(http.StatusOK, gin.H{"userID": result.InsertedID})
// }

func Signup(c *gin.Context) {
    var user models.User
    if err := c.BindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Generate incremental user ID
    userID, err := models.GetNextUserID()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate user ID"})
        return
    }
    user.ID = userID

    // Hash password before storing
    hashedPassword, err := utils.HashPassword(user.Password)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
        return
    }
    user.Password = hashedPassword

    // Set default avatar
    user.Avatar = "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png"

    // Set created and updated timestamps
    now := time.Now()
    user.CreatedAt = now
    user.UpdatedAt = now

    // Insert user into database
    collection := db.MongoClient.Database("project_tracker").Collection("users")
    result, err := collection.InsertOne(c, user)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"userID": result.InsertedID})
}

// func Login(c *gin.Context) {
//     var loginData struct {
//         Email    string `json:"email"`
//         Password string `json:"password"`
//     }
//     if err := c.BindJSON(&loginData); err != nil {
//         c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
//         return
//     }

//     var user models.User
//     collection := db.MongoClient.Database("project_tracker").Collection("users")
//     err := collection.FindOne(c, bson.M{"email": loginData.Email}).Decode(&user)
//     if err != nil {
//         if err == mongo.ErrNoDocuments {
//             c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
//             return
//         }
//         c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
//         return
//     }

//     if !utils.CheckPasswordHash(loginData.Password, user.Password) {
//         c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
//         return
//     }

//     token, err := utils.GenerateJWT(user.ID.Hex(), user.Role)
//     if err != nil {
//         c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
//         return
//     }

//     c.JSON(http.StatusOK, gin.H{"token": token})
// }

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

    // Convert user.ID to string
    userID := strconv.Itoa(user.ID)

    // Generate JWT token
    token, err := utils.GenerateJWT(userID, user.Role)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"token": token})
}