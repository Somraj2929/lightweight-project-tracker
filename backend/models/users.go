package models

import (
    "time"

)

type User struct {
    ID        int                `bson:"_id"`
    Name      string             `bson:"name"`
    Email     string             `bson:"email"`
    Team      string             `bson:"team"`
    Role      string             `bson:"role"`
    Avatar    string             `bson:"avatar"`
    CreatedAt time.Time          `bson:"createdAt"`
    UpdatedAt time.Time          `bson:"updatedAt"`
    Password  string             `bson:"password"`
}

type CheckIn struct {
    ID        int       `bson:"_id"`
    Name      string    `bson:"name"`
    Email     string    `bson:"email"`
    Team      string    `bson:"team"`
    Role      string    `bson:"role"`
    Avatar    string    `bson:"avatar"`
    CreatedAt time.Time `bson:"createdAt"`
    UpdatedAt time.Time `bson:"updatedAt"`
}

// Function to convert User to CheckIn
func (u User) ToCheckIn() CheckIn {
    return CheckIn{
            ID:        u.ID,
            Name:      u.Name,
            Email:     u.Email,
            Team:      u.Team,
            Role:      u.Role,
            Avatar:    u.Avatar,
            CreatedAt: u.CreatedAt,
            UpdatedAt: u.UpdatedAt,
    }
}
