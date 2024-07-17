package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/Somraj2929/lightweight-project-tracker/controllers"
	"github.com/Somraj2929/lightweight-project-tracker/middleware"
)

func ChatRoutes(router *gin.Engine) {
	chat := router.Group("/chats")
	{
		chat.POST("/", middleware.AuthMiddleware(), controllers.CreateChatRoom)
		chat.GET("/:id", middleware.AuthMiddleware(), controllers.GetChatDetails)
		chat.POST("/:id", middleware.AuthMiddleware(), controllers.SendMessage)
		chat.POST("/:id/join", middleware.AuthMiddleware(), controllers.JoinChatRoom)
		chat.POST("/:id/close", middleware.AuthMiddleware(), controllers.CloseChatRoom)
		chat.GET("/ws", controllers.ServeWebSocket) 
	}
}
