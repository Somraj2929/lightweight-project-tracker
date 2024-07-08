package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/Somraj2929/lightweight-project-tracker/controllers"
    "github.com/Somraj2929/lightweight-project-tracker/middleware"
)

func UserRoutes(router *gin.Engine) {
    user := router.Group("/users")
    {
        user.GET("/:id", middleware.AuthMiddleware(), controllers.GetUserDetails)
        user.PUT("/:id/avatar", middleware.AuthMiddleware(), controllers.UpdateUserAvatar)
        user.GET("/", middleware.AuthMiddleware(), controllers.GetAllUsers)
        user.PUT("/:id", middleware.AuthMiddleware(), controllers.UpdateUserDetails)
    }
}
