package projects

import (
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"

	"github.com/Somraj2929/lightweight-project-tracker/database"
)

func ProjectsHandler(c *gin.Context) {
	// Get MongoDB collection
    log.Println("ProjectsHandler")
	collection := database.GetCollection("project_tracker", "projects")
	if collection == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to database"})
		return
	}

	// Query MongoDB for all projects
	cursor, err := collection.Find(context.TODO(), bson.D{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data"})
		return
	}
	defer cursor.Close(context.TODO())

	// Decode query results
	var projects []bson.M
	if err := cursor.All(context.TODO(), &projects); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode data"})
		return
	}

	// Respond with JSON
	c.JSON(http.StatusOK, projects)
}
