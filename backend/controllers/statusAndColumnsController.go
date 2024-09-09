package controllers

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"

	"github.com/Somraj2929/lightweight-project-tracker/db"
)

func ColumnStatusHandler(c *gin.Context) {

    collection := db.MongoClient.Database("project_tracker").Collection("columnsStatusOptions")
    if collection == nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to database"})
        return
    }

    cursor, err := collection.Find(context.TODO(), bson.D{})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data"})
        return
    }
    defer cursor.Close(context.TODO())

    var columns []bson.M
    if err := cursor.All(context.TODO(), &columns); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode data"})
        return
    }

    c.JSON(http.StatusOK, columns)
}
