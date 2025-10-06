#!/bin/bash

# Go客服系统构建脚本 - 简化版本

# 确保我们在项目根目录
cd "$(dirname "$0")/.."

# 打印当前工作目录（用于调试）
echo "Current directory: $(pwd)"

# 检查是否有预编译的二进制文件
echo "Checking for pre-built GoFly binary..."
if [ -f "src/goflylivechat/goflylivechat.exe" ]; then
    echo "Found pre-built Windows binary. Copying..."
    cp "src/goflylivechat/goflylivechat.exe" "src/goflylivechat/goflylivechat"
    chmod +x "src/goflylivechat/goflylivechat"
    echo "Pre-built binary prepared successfully."
    exit 0
fi

# 如果没有预编译的二进制文件且Go环境可用，则构建
if command -v go &> /dev/null; then
    echo "Go is available. Building GoFly service..."
    cd src/goflylivechat
    
    echo "Current directory: $(pwd)"
    echo "Downloading dependencies..."
    go mod download
    
    echo "Building binary..."
    export CGO_ENABLED=0
    go build -o goflylivechat
    
    # 检查构建是否成功
    if [ $? -eq 0 ]; then
        echo "GoFly service built successfully"
        chmod +x goflylivechat
    else
        echo "Failed to build GoFly service"
        exit 1
    fi
else
    echo "Warning: Go is not available and no pre-built binary found."
    echo "This may cause issues with GoFly chat functionality."
fi

# 确保静态文件可访问
echo "Preparing static files..."
if [ -d "src/goflylivechat/static" ]; then
    mkdir -p public/gochat
    ln -sf "$(pwd)/src/goflylivechat/static" "$(pwd)/public/gochat/static" 2>/dev/null || \
    cp -r "src/goflylivechat/static" "public/gochat/" 2>/dev/null || \
    echo "Warning: Failed to prepare static files."
fi

# 确保配置文件存在
if [ ! -f "src/goflylivechat/config/mysql.json" ] && [ -f "src/goflylivechat/config/mysql.json.sample" ]; then
    echo "Creating default configuration..."
    cp "src/goflylivechat/config/mysql.json.sample" "src/goflylivechat/config/mysql.json"
fi

echo "GoFly service build process completed"

# 复制配置文件
echo "Preparing configuration files..."
if [ ! -f "config/mysql.json" ] && [ -f "src/goflylivechat/config/mysql.json.sample" ]; then
    mkdir -p config
    echo '{"Server":"localhost","Port":"3306","Database":"gofly","Username":"root","Password":""}' > config/mysql.json
    echo "Created default mysql.json configuration"
fi

# 回到项目根目录
cd ../..

echo "Go chat service build process completed"