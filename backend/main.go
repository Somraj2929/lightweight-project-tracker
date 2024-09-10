package main

import (
    "os"
    "time"
    "net/http"
    
    "github.com/Somraj2929/lightweight-project-tracker/db"
    "github.com/Somraj2929/lightweight-project-tracker/routes"
    "github.com/Somraj2929/lightweight-project-tracker/utils"
    "github.com/newrelic/go-agent/v3/newrelic"
    nrgin "github.com/newrelic/go-agent/v3/integrations/nrgin"
    "github.com/rs/zerolog"
    "github.com/newrelic/go-agent/v3/integrations/logcontext-v2/zerologWriter"
    "github.com/gin-gonic/gin"
)

func main() {
    
    app, err := newrelic.NewApplication(
        newrelic.ConfigAppName("backend-tracker"),
        newrelic.ConfigLicense(os.Getenv("NEW_RELIC_LICENSE_KEY")),
        newrelic.ConfigAppLogForwardingEnabled(true),
    )
    if err != nil {
        panic(err)
    }

    // Create a zerologWriter for New Relic
    writer := zerologWriter.New(os.Stdout, app)
    // Create a zerolog logger with the writer
    logger := zerolog.New(writer).With().Timestamp().Logger()

    // Log application startup
    logger.Info().Msg("Application starting")

    // Seed the random number generator
    seedValue := time.Now().UnixNano()
    utils.Seed(seedValue)

    // Connect to MongoDB
    db.ConnectMongoDB()

    // Setup Gin
    router := gin.Default()
    router.Use(nrgin.Middleware(app))
    router.Use(func(c *gin.Context) {
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

    // Setup routes
    routes.AuthRoutes(router)
    routes.UserRoutes(router)
    routes.ProjectRoutes(router)
    routes.ChatRoutes(router)
    routes.StatusAndColumnsRoutes(router)

    // Start server
    err = router.Run(":" + os.Getenv("PORT"))
    if err != nil {
        logger.Error().Err(err).Msg("Failed to start server")
        panic(err)
    }
}
