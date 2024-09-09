package utils

import (
	"log"
	"net/smtp"
	"os"
	"fmt"
)

func SendPasswordResetEmail(email, token string, userName string) {
	from := os.Getenv("RESET_EMAIL")
	password := os.Getenv("RESET_EMAIL_PASSWORD")
	to := email
	subject := "Password Reset Request"
	body := fmt.Sprintf(`
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="UTF-8">
		<title>Password Reset Request</title>
	</head>
	<body>
		<p>Hi %s,</p>
		<p>You requested to reset your password. Please click the link below to reset your password:</p>
		<p>
			<a href="https://project-tracker.somraj.tech/users/reset-password?token=%s" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">
				Reset Password
			</a>
		</p>
		<p>If you did not request this change, please ignore this email.</p>
		<p>Thank you,<br>Project Tracker Admin</p>
	</body>
	</html>
	`, userName, token)

	message := []byte("From: " + from + "\r\n" +
		"To: " + to + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"MIME-version: 1.0;\r\n" +
		"Content-Type: text/html; charset=\"UTF-8\";\r\n" +
		"\r\n" + body + "\r\n")

	auth := smtp.PlainAuth("", from, password, "us2.smtp.mailhostbox.com")

	err := smtp.SendMail("us2.smtp.mailhostbox.com:587", auth, from, []string{to}, message)
	if err != nil {
		log.Printf("Failed to send email from %s to %s: %v", from, to, err)
		return
	}

	log.Printf("Password reset email sent successfully from %s to %s", from, to)
}
