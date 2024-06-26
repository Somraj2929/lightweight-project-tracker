package main

import (
	"github.com/Somraj2929/lightweight-project-tracker/api/handlers/test"
	"log"
	"net/http"
	"os"
	
)

func main() {
	http.Handle("/", http.HandlerFunc(test.TestHandler))
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Printf("Server listening on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}