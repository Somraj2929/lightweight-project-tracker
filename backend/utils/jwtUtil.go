package utils

import (
	
	"time"
    "log"

	"github.com/dgrijalva/jwt-go"
    
)



var jwtKey = []byte("somraj@2929")

type Claims struct {
    UserID string `json:"userID"`
    Role   string `json:"role"`
    jwt.StandardClaims
}

func GenerateJWT(userID, role string) (string, error) {
    log.Println("Generating JWT", jwtKey)
    expirationTime := time.Now().Add(24 * time.Hour)
    claims := &Claims{
        UserID: userID,
        Role:   role,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: expirationTime.Unix(),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    tokenString, err := token.SignedString(jwtKey)
    if err != nil {
        return "", err
    }

    return tokenString, nil
}

func ValidateJWT(tokenString string) (*Claims, error) {
    claims := &Claims{}
    token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
        return jwtKey, nil
    })

    if err != nil {
        return nil, err
    }

    if !token.Valid {
        return nil, err
    }

    return claims, nil
}
