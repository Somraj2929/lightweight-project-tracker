package models

import (
	"time"
)

type Chat struct {
	ID             string    `bson:"_id"`
	CreatedAt      time.Time `bson:"createdAt"`
	Messages       []Message `bson:"messages"`
	MessageCounter int       `bson:"messageCounter"` // New field for auto-incrementing message ID
}

type Message struct {
	ID        int       `bson:"id"` // Change to int
	Text      string    `bson:"text" json:"text"`
	Timestamp time.Time `bson:"timestamp"`
	UserID    int       `bson:"user_id" json:"user_id"` // Add JSON tag for proper binding
}
