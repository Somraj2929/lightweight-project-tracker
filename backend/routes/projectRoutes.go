package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/Somraj2929/lightweight-project-tracker/controllers"
    "github.com/Somraj2929/lightweight-project-tracker/middleware"
)

func ProjectRoutes(router *gin.Engine) {
    project := router.Group("/projects")
    {
        project.POST("/", middleware.AuthMiddleware(), controllers.CreateProject)
        project.GET("/:id", middleware.AuthMiddleware(), controllers.GetProjectDetails)
        project.PUT("/:id", middleware.AuthMiddleware(), controllers.UpdateProject)
        project.GET("/", middleware.AuthMiddleware(), controllers.GetAllProjects) 
		project.DELETE("/:id/:userID", middleware.AuthMiddleware(), controllers.DeleteProject) 
    }
}
