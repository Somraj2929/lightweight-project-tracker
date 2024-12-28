package main

import (
    "os"
    "time"
    "log"
    
    "github.com/Somraj2929/lightweight-project-tracker/db"
    "github.com/Somraj2929/lightweight-project-tracker/routes"
    "github.com/Somraj2929/lightweight-project-tracker/utils"
    "github.com/newrelic/go-agent/v3/newrelic"
    nrgin "github.com/newrelic/go-agent/v3/integrations/nrgin"
    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"
    "github.com/newrelic/go-agent/v3/integrations/logcontext-v2/logWriter"
)

func main() {

    err := godotenv.Load()
    if err != nil {
        panic(err)
    }
    
    app, err := newrelic.NewApplication(
        newrelic.ConfigAppName("backend-tracker"),
        newrelic.ConfigLicense(os.Getenv("NEW_RELIC_LICENSE_KEY")),
        newrelic.ConfigAppLogForwardingEnabled(true),
    )
    if err != nil {
        log.Fatalf("Error initializing New Relic application: %v", err)
    }

    writer := logWriter.New(os.Stdout, app)
    log.SetOutput(writer)
    log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
    log.Println("New Relic application initialized successfully")
    writer.DebugLogging(true)


    // Seed the random number generator
    seedValue := time.Now().UnixNano()
    utils.Seed(seedValue)

    // Connect to MongoDB
    db.ConnectMongoDB()

    // Setup Gin
    router := gin.Default()
    router.Use(nrgin.Middleware(app))
    // router.Use(func(c *gin.Context) {
    //     c.Writer.Header().Set("Access-Control-Allow-Origin", "*") 
    //     c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    //     c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    //     c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

    //     if c.Request.Method == "OPTIONS" {
    //         c.AbortWithStatus(http.StatusOK)
    //         return
    //     }

    //     c.Next()
    // })

    // Setup routes
    routes.AuthRoutes(router)
    routes.UserRoutes(router)
    routes.ProjectRoutes(router)
    routes.ChatRoutes(router)
    routes.StatusAndColumnsRoutes(router)

    // Start server
    err = router.Run(":" + os.Getenv("PORT"))
    if err != nil {
        log.Fatalf("Error starting server: %v", err)
    }
}
