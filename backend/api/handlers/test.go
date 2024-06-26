package test

import (
	"github.com/gin-gonic/gin"
	"fmt"
)

func TestHandler(c *gin.Context) {
	fmt.Println("TestHandler")

	// You can also set the response status code if needed
	// w.WriteHeader(http.StatusOK)
}