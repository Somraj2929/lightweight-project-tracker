package main

import (
    "os"
    "time"
    "log"
    "net/http"
    
    "github.com/Somraj2929/lightweight-project-tracker/db"
    "github.com/Somraj2929/lightweight-project-tracker/routes"
    "github.com/Somraj2929/lightweight-project-tracker/utils"
    //"github.com/joho/godotenv"
    "github.com/gin-gonic/gin"
)

func main() {

    // err := godotenv.Load()
    // if err != nil {
    //     panic(err)
    // }

    seedValue := time.Now().UnixNano()
    utils.Seed(seedValue)
    
    db.ConnectMongoDB()

    
    router := gin.Default()
    router.Use(func(c *gin.Context) {
        //c.Writer.Header().Set("Access-Control-Allow-Origin", "https://lightweight-project-tracker.vercel.app")
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*") 
        c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(http.StatusOK)
            return
        }

        c.Next()
    })

  
    routes.AuthRoutes(router)
    routes.UserRoutes(router)
    routes.ProjectRoutes(router)
    routes.ChatRoutes(router)
    routes.StatusAndColumnsRoutes(router)

   
    err := router.Run(":" + os.Getenv("PORT"))
    if err != nil {
        log.Fatalf("Error starting server: %v", err)
    }
}
