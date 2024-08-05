package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/Somraj2929/lightweight-project-tracker/controllers"
)

func AuthRoutes(router *gin.Engine) {
    auth := router.Group("/auth")
    {
        auth.POST("/signup", controllers.Signup)
        auth.POST("/login", controllers.Login)
        auth.POST("/request-password-reset", controllers.RequestPasswordReset)
		auth.POST("/reset-password", controllers.ResetPassword)
    }
}
