package utils

import (
	"crypto/md5"
	"encoding/hex"
	"regexp"
)

func GetMD5Hash(text string) string {
	hash := md5.Sum([]byte(text))
	return hex.EncodeToString(hash[:])
}

func ValidateEmail(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`)
	return emailRegex.MatchString(email)
}

func ValidatePhoneNumber(phoneNumber string) bool {
	phoneNumberRegex := regexp.MustCompile(`^\+?(84|0)+[3|5|7|8|9]+([0-9]{8})$`)
	return phoneNumberRegex.MatchString(phoneNumber)
}
