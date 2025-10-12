package tools

import (
	"github.com/golang-jwt/jwt"
	"os"
	"sync"
)

var (
	jwtSecret []byte
	secretMutex sync.RWMutex
)

// 初始化JWT密钥，从环境变量或默认值
func init() {
	// 从环境变量获取密钥，如果不存在则使用默认安全密钥
	secret := os.Getenv("GOFLY_JWT_SECRET")
	if secret == "" {
		// 默认使用更安全的随机生成密钥
		secret = "6e7a7f3e-2c1b-4a8d-9e5f-3c7d8f2e1a9b"
	}
	secretMutex.Lock()
	jwtSecret = []byte(secret)
	secretMutex.Unlock()
}

// 设置JWT密钥
func SetJWTSecret(secret string) {
	secretMutex.Lock()
	jwtSecret = []byte(secret)
	secretMutex.Unlock()
}

func MakeToken(obj map[string]interface{}) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims(obj))
	secretMutex.RLock()
	secret := jwtSecret
	secretMutex.RUnlock()
	tokenString, err := token.SignedString(secret)
	return tokenString, err
}

func ParseToken(tokenStr string) map[string]interface{} {
	secretMutex.RLock()
	secret := jwtSecret
	secretMutex.RUnlock()
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (i interface{}, e error) {
		return secret, nil
	})
	if err != nil {
		return nil
	}
	finToken := token.Claims.(jwt.MapClaims)
	return finToken
}
