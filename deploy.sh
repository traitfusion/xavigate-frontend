#!/bin/bash

# Frontend deployment script
# This script builds and deploys the frontend to the web server

set -e  # Exit on error

echo "🚀 Starting frontend deployment..."

# Build the frontend
echo "📦 Building frontend..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed: dist directory not found"
    exit 1
fi

# Deploy to web server
echo "📤 Deploying to /var/www/xavigate-frontend/..."
sudo cp -r dist/* /var/www/xavigate-frontend/

# Set proper permissions (optional, adjust as needed)
sudo chown -R www-data:www-data /var/www/xavigate-frontend/
sudo chmod -R 755 /var/www/xavigate-frontend/

echo "✅ Deployment complete!"
echo "🌐 Frontend deployed to https://chat.xavigate.com"