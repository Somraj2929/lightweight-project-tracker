package utils

import (
    "fmt"
    "math/rand"
    "strconv"
    "time"

    "github.com/Somraj2929/lightweight-project-tracker/models"
)

// Global random generator
var rng = rand.New(rand.NewSource(time.Now().UnixNano()))

const (
    letterBytes   = "abcdefghijklmnopqrstuvwxyz"
    chatIDPattern = "%s-%s-%04d"
)

func generateRandomLetters(n int) string {
    b := make([]byte, n)
    for i := range b {
        b[i] = letterBytes[rng.Intn(len(letterBytes))]
    }
    return string(b)
}

func GenerateChatID() (string, error) {  // Exported function
    year := time.Now().Year()
    randomLetters := generateRandomLetters(4)

    incr, err := models.GetNextChatSequenceValue()
    if err != nil {
        return "", err
    }

    chatID := fmt.Sprintf(chatIDPattern, strconv.Itoa(year), randomLetters, incr)
    return chatID, nil
}

// Seed initializes the random number generator with the provided seed value.
func Seed(seed int64) {
    rng = rand.New(rand.NewSource(seed))
}
