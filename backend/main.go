package main

import (
	"log"
	"time"
	// "github.com/Somraj2929/lightweight-project-tracker/config"
	"github.com/Somraj2929/lightweight-project-tracker/db"
	"github.com/Somraj2929/lightweight-project-tracker/routes"
	"github.com/Somraj2929/lightweight-project-tracker/utils"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
    // Load environment variables
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

	seedValue := time.Now().UnixNano() // Example: use current time as seed
    utils.Seed(seedValue)

    // Connect to MongoDB
    db.ConnectMongoDB()

    // Connect to Redis
    //db.ConnectRedis(config.GetEnv("REDIS_ADDR"), config.GetEnv("REDIS_PASSWORD"), 0)
	//db.ConnectRedis("localhost:6379", "", 0)

    // Setup Gin
    router := gin.Default()

    // Setup routes
    routes.AuthRoutes(router)
    routes.UserRoutes(router)
    routes.ProjectRoutes(router)
    routes.ChatRoutes(router)
    routes.StatusAndColumnsRoutes(router)

    // Start server
    router.Run(":8081")
}
