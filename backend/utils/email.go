package utils

import (
	"log"
	"net/smtp"
	"os"
)

func SendPasswordResetEmail(email, token string) {
	from := os.Getenv("RESET_EMAIL")
	password := os.Getenv("RESET_EMAIL_PASSWORD")
	to := email
	subject := "Password Reset Request"
	body := "Click the link to reset your password: http://localhost:3000/users/reset-password?token=" + token

	message := []byte("From: " + from + "\r\n" +
		"To: " + to + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" + body + "\r\n")
	auth := smtp.PlainAuth("", from, password, "us2.smtp.mailhostbox.com")

	err := smtp.SendMail("us2.smtp.mailhostbox.com:587", auth, from, []string{to}, message)
	if err != nil {
		log.Printf("Failed to send email from %s to %s: %v", from, to, err)
		return
	}

	log.Printf("Password reset email sent successfully from %s to %s", from, to)
}
