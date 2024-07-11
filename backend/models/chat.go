package models

import (
	"time"
)


type Chat struct {
	ID             string    `bson:"_id" json:"id"`
	CreatedAt      time.Time `bson:"createdAt" json:"createdAt"`
	MessageCounter int       `bson:"messageCounter" json:"messageCounter"`
	Status         string    `bson:"status" json:"status"`
	Messages       []Message `bson:"messages" json:"messages"`
	CreatedBy      int    `bson:"createdBy" json:"createdBy"`
}


type Message struct {
	ID        int       `bson:"id" json:"id"`
	Text      string    `bson:"text" json:"text"`
	Timestamp time.Time `bson:"timestamp" json:"timestamp"`
	UserID    int       `bson:"userId" json:"userId"`
}