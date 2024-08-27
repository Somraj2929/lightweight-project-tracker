package main

import (
	"os"
	"time"
    "net/http"
    
	// "github.com/Somraj2929/lightweight-project-tracker/config"
	"github.com/Somraj2929/lightweight-project-tracker/db"
	"github.com/Somraj2929/lightweight-project-tracker/routes"
	"github.com/Somraj2929/lightweight-project-tracker/utils"
    "github.com/newrelic/go-agent/v3/newrelic"
    nrgin "github.com/newrelic/go-agent/v3/integrations/nrgin"


	"github.com/gin-gonic/gin"
	
)

func main() {
   
    app, err := newrelic.NewApplication(
        newrelic.ConfigAppName(""),
        newrelic.ConfigLicense("913a16c1be1683863567bfed29a4ec27FFFFNRAL"),
        newrelic.ConfigAppLogForwardingEnabled(true),
      )
      
      
    

	seedValue := time.Now().UnixNano() 
    utils.Seed(seedValue)

    // Connect to MongoDB
    db.ConnectMongoDB()

    // Connect to Redis
    //db.ConnectRedis(config.GetEnv("REDIS_ADDR"), config.GetEnv("REDIS_PASSWORD"), 0)
	//db.ConnectRedis("localhost:6379", "", 0)

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
    
    _ = router.Run(":" + os.Getenv("PORT"))
    if err != nil {
        panic(err)
    }

}
