package main

import (
	test "github.com/Somraj2929/lightweight-project-tracker/api/handlers"
	projects "github.com/Somraj2929/lightweight-project-tracker/api/projects"
	database "github.com/Somraj2929/lightweight-project-tracker/database"
	"log"
	
	"os"
	"github.com/gin-gonic/gin"
)

func main() {
	loadenv := database.LoadEnv()
	if loadenv != nil {
		log.Fatalf("Error loading .env file: %v", loadenv)
	}

	err := database.ConnectToMongo()
	if err != nil {
		log.Fatalf("Error connecting database: %v", err)
	}

	// Create a new Gin router
	router := gin.Default()



	router.GET("/test", test.TestHandler)

	router.GET("/projects", projects.ProjectsHandler)


	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}

	if err := router.Run(port); err != nil {
		panic(err)
	}
}
