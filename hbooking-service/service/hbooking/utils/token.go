package utils

import (
	"math/rand"
	"time"

	"github.com/golang-jwt/jwt"
)

func GetJwtToken(secretKey string, iat, seconds, userId int64, role int) (string, error) {

	claims := make(jwt.MapClaims)
	claims["exp"] = iat + seconds
	claims["iat"] = iat
	claims["userId"] = userId
	claims["role"] = role

	token := jwt.New(jwt.SigningMethodHS256)
	token.Claims = claims

	return token.SignedString([]byte(secretKey))
}

func GenerateResetToken() string {
	rand.Seed(time.Now().UnixNano())
	tokenLength := 20
	charset := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	token := make([]byte, tokenLength)
	for i := range token {
		token[i] = charset[rand.Intn(len(charset))]
	}
	return string(token)
}
