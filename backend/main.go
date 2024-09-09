package main

import (
    "os"
    "time"
    "net/http"

    "github.com/Somraj2929/lightweight-project-tracker/db"
    "github.com/Somraj2929/lightweight-project-tracker/routes"
    "github.com/Somraj2929/lightweight-project-tracker/utils"

    "github.com/gin-gonic/gin"
    "github.com/newrelic/go-agent/v3/newrelic"
    "github.com/newrelic/go-agent/v3/integrations/nrgin"
    "github.com/newrelic/go-agent/v3/integrations/logcontext-v2/nrzap"
    "go.uber.org/zap"
    "go.uber.org/zap/zapcore"
)

func main() {
    
    core := zapcore.NewCore(
        zapcore.NewJSONEncoder(zap.NewProductionEncoderConfig()),
        zapcore.AddSync(os.Stdout),
        zap.InfoLevel,
    )

    
    backgroundLogger := zap.New(core)
    defer backgroundLogger.Sync() 

    // Initialize New Relic application with error logging
    app, err := newrelic.NewApplication(
        newrelic.ConfigAppName("backend-tracker"),
        newrelic.ConfigLicense("YOUR_NEW_RELIC_LICENSE_KEY"), 
        newrelic.ConfigAppLogForwardingEnabled(true),
        newrelic.ConfigDebugLogger(os.Stdout), 
    )
    if err != nil {
        backgroundLogger.Error("failed to initialize New Relic", zap.Error(err))
        return
    }

    if app == nil {
        backgroundLogger.Fatal("New Relic app is nil after initialization")
        return
    }

    txn := app.StartTransaction("nrzap-example-transaction")
    txnCore, err := nrzap.WrapTransactionCore(core, txn)
    if err != nil && err != nrzap.ErrNilTxn {
        backgroundLogger.Error("failed to wrap transaction core", zap.Error(err))
        return
    }

    txnLogger := zap.New(txnCore)
    txnLogger.Info("transaction log message", zap.String("info", "transaction log message"))

    seedValue := time.Now().UnixNano()
    utils.Seed(seedValue)

    db.ConnectMongoDB()

    router := gin.Default()
    router.Use(nrgin.Middleware(app))

    // Allow CORS
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

    port := os.Getenv("PORT")
    if port == "" {
        port = "8080" // Default port
    }

    err = router.Run(":" + port)
    if err != nil {
        backgroundLogger.Fatal("failed to start server", zap.Error(err))
    }
}
