package controllers

import (
	"net/http"
	"time"
	"strconv"

	"github.com/Somraj2929/lightweight-project-tracker/db"
	"github.com/Somraj2929/lightweight-project-tracker/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	//"go.mongodb.org/mongo-driver/bson/primitive"
)

type ProjectResponse struct {
    ID          int                `json:"id"`
    Name        string             `json:"name"`
    Team        string             `json:"team"`
    Status      string             `json:"status"`
    CreatedAt   string             `json:"createdAt"`
    UpdatedAt   string             `json:"updatedAt"`
    FromUserID  int                `json:"fromUserId"`
    ToUserID    int                `json:"toUserId"`
    Description string             `json:"description"`
    Comments    []CommentResponse  `json:"comments"`
    CommentCounter int        	   `json:"commentCounter"`
}

type CommentResponse struct {
    ID        int    `json:"id"`
    Comment   string `json:"comment"`
    CreatedAt string `json:"createdAt"`
    UserID    int    `json:"userId"`
}


func CreateProject(c *gin.Context) {
    var project models.Project
    if err := c.BindJSON(&project); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Generate incremental project ID
    projectID, err := models.GetNextProjectID()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate project ID"})
        return
    }
    project.ID = projectID

    project.CreatedAt = time.Now()
    project.UpdatedAt = time.Now()
    

    // Initialize comment IDs and set created timestamp
    for i := range project.Comments {
        project.Comments[i].ID = i
        project.Comments[i].CreatedAt = time.Now()
    }

    collection := db.MongoClient.Database("project_tracker").Collection("projects")
    result, err := collection.InsertOne(c, project)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"insertID": result.InsertedID, "projectID": projectID})
}





func GetProjectDetails(c *gin.Context) {
    projectID := c.Param("id")
    id, err := strconv.Atoi(projectID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
        return
    }


    var project models.Project
    

    collection := db.MongoClient.Database("project_tracker").Collection("projects")
    err = collection.FindOne(c, bson.M{"id": id}).Decode(&project)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    projectResponse := ProjectResponse{
        ID:            project.ID,
        Name:          project.Name,
        Team:          project.Team,
        Status:        project.Status,
        CreatedAt:     project.CreatedAt.Format("2006-01-02 15:04:05"), // Example format
        UpdatedAt:     project.UpdatedAt.Format("2006-01-02 15:04:05"), // Example format
        FromUserID:    project.FromUserID,
        ToUserID:      project.ToUserID,
        Description:   project.Description,
        Comments:      convertCommentsToResponse(project.Comments),
        CommentCounter: project.CommentCounter,
    }

    c.JSON(http.StatusOK, projectResponse)
}




func UpdateProject(c *gin.Context) {
    projectID := c.Param("id")
    id, err := strconv.Atoi(projectID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
        return
    }

    var updateData models.Project
    if err := c.BindJSON(&updateData); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    updateData.UpdatedAt = time.Now()

    // Fetch existing project data including comments
    existingProject, err := getProjectByID(c, id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // Calculate max comment ID in existing comments
    maxCommentID := getMaxCommentID(existingProject.Comments)

    // Combine existing comments with new comments, assigning new IDs to new comments
    updateData.Comments = assignNewCommentIDs(existingProject.Comments, updateData.Comments, maxCommentID)

    // Update comment counter based on the combined comments
    updateData.CommentCounter = len(updateData.Comments)

    collection := db.MongoClient.Database("project_tracker").Collection("projects")
    _, err = collection.UpdateOne(c, bson.M{"id": id}, bson.M{"$set": updateData})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Project updated successfully"})
}

func getMaxCommentID(comments []models.Comment) int {
    maxID := -1
    for _, comment := range comments {
        if comment.ID > maxID {
            maxID = comment.ID
        }
    }
    return maxID
}

func assignNewCommentIDs(existingComments, newComments []models.Comment, startID int) []models.Comment {
    id := startID + 1
    combined := append(existingComments, newComments...)
    for i := range combined {
        if combined[i].ID == 0 {
            combined[i].ID = id
            combined[i].CreatedAt = time.Now()
            id++
        }
    }
    return combined
}


func getProjectByID(c *gin.Context, id int) (models.Project, error) {
	var project models.Project
	collection := db.MongoClient.Database("project_tracker").Collection("projects")
	err := collection.FindOne(c, bson.M{"id": id}).Decode(&project)
	if err != nil {
		return project, err
	}
	return project, nil
}


func DeleteProject(c *gin.Context) {
	projectID := c.Param("id")
	id, err := strconv.Atoi(projectID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	collection := db.MongoClient.Database("project_tracker").Collection("projects")
	_, err = collection.DeleteOne(c, bson.M{"id": id})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project deleted successfully"})
}


func GetAllProjects(c *gin.Context) {
    var projects []models.Project

    collection := db.MongoClient.Database("project_tracker").Collection("projects")
    cursor, err := collection.Find(c, bson.M{})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer cursor.Close(c)

    for cursor.Next(c) {
        var project models.Project
        if err := cursor.Decode(&project); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        projects = append(projects, project)
    }

    if err := cursor.Err(); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    var projectsResponse []ProjectResponse
    for _, project := range projects {
        projectResponse := ProjectResponse{
            ID:            project.ID,
            Name:          project.Name,
            Team:          project.Team,
            Status:        project.Status,
            CreatedAt:     project.CreatedAt.Format("2006-01-02 15:04:05"), // Example format
            UpdatedAt:     project.UpdatedAt.Format("2006-01-02 15:04:05"), // Example format
            FromUserID:    project.FromUserID,
            ToUserID:      project.ToUserID,
            Description:   project.Description,
            Comments:      convertCommentsToResponse(project.Comments),
            CommentCounter: project.CommentCounter,
        }
        projectsResponse = append(projectsResponse, projectResponse)
    }

    c.JSON(http.StatusOK, projectsResponse)
}

func convertCommentsToResponse(comments []models.Comment) []CommentResponse {
    var commentsResponse []CommentResponse
    for _, comment := range comments {
        commentResponse := CommentResponse{
            ID:        comment.ID,
            Comment:   comment.Comment,
            CreatedAt: comment.CreatedAt.Format("2006-01-02 15:04:05"), // Example format
            UserID:    comment.UserID,
        }
        commentsResponse = append(commentsResponse, commentResponse)
    }
    return commentsResponse
}