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
	
	app, err := newrelic.NewApplication(
        newrelic.ConfigAppName("backend-tracker"),
        newrelic.ConfigLicense("913a16c1be1683863567bfed29a4ec27FFFFNRAL"),
        newrelic.ConfigAppLogForwardingEnabled(true),
      )
	if err != nil {
		panic("failed to initialize New Relic:" + err.Error())
	}

    if app == nil {
        panic("New Relic app is nil after initialization")
    }

	// Set up Zap logger core
	core := zapcore.NewCore(
		zapcore.NewJSONEncoder(zap.NewProductionEncoderConfig()),
		zapcore.AddSync(os.Stdout),
		zap.InfoLevel,
	)

	// Wrap Zap core to enable log forwarding to New Relic
	backgroundCore, err := nrzap.WrapBackgroundCore(core, app)
	if err != nil && err != nrzap.ErrNilApp {
		panic(err)
	}

	// Create a background logger
	backgroundLogger := zap.New(backgroundCore)
	defer backgroundLogger.Sync()

	// Log a message
	txn := app.StartTransaction("nrzap example transaction") 
	defer txn.End()

	txnCore, err := nrzap.WrapTransactionCore(core, txn)
	if err != nil && err != nrzap.ErrNilTxn {
		panic(err)
	}

	txnLogger := zap.New(txnCore)
	txnLogger.Info("transaction log message", zap.String("info", "transaction log message"))

	
	seedValue := time.Now().UnixNano()
	utils.Seed(seedValue)

	
	db.ConnectMongoDB()

	
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

	
	routes.AuthRoutes(router)
	routes.UserRoutes(router)
	routes.ProjectRoutes(router)
	routes.ChatRoutes(router)
	routes.StatusAndColumnsRoutes(router)

	
	err = router.Run(":" + os.Getenv("PORT"))
	if err != nil {
		backgroundLogger.Fatal("failed to start server", zap.Error(err))
	}
}
