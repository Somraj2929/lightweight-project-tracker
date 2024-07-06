package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/Somraj2929/lightweight-project-tracker/controllers"
    "github.com/Somraj2929/lightweight-project-tracker/middleware"
)

func StatusAndColumnsRoutes(router *gin.Engine) {
    statusAndColumns := router.Group("/statusandcolumns")
    {
        statusAndColumns.GET("/", middleware.AuthMiddleware(), controllers.ColumnStatusHandler)
    }
}
