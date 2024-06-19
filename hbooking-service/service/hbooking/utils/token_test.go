package utils

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestGetJwtToken(t *testing.T) {
	// Test with valid parameters
	secretKey := "mysecretkey"
	iat := time.Now().Unix()
	seconds := 3600
	userId := 123456789
	role := 1

	token, err := GetJwtToken(secretKey, iat, int64(seconds), int64(userId), role)
	assert.Nil(t, err)
	assert.NotEmpty(t, token)
}

func TestGenerateResetToken(t *testing.T) {
	// Test with valid parameters
	tokenLength := 20

	token := GenerateResetToken()
	assert.Equal(t, tokenLength, len(token))
}
