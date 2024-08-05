package models

import (
	"time"
)

type PasswordResetRequest struct {
	Email     string    `bson:"email"`
	Timestamp time.Time `bson:"timestamp"`
}
