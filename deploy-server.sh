#!/bin/bash

# Server-side deployment script for Xavigate frontend
# Run this script from the xavigate-frontend directory on the server

set -e  # Exit on error

echo "🚀 Starting Xavigate frontend deployment..."

# Ensure we're in the right directory
# Script assumes you're already in /home/ec2-user/xavigate-frontend

# Pull latest changes (optional - remove if you've already pulled)
echo "📥 Pulling latest changes..."
git pull

# Install dependencies if package.json changed
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Build the frontend
echo "🔨 Building frontend..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed: dist directory not found"
    exit 1
fi

# Deploy to web server
echo "📤 Deploying to /var/www/xavigate-frontend/..."
sudo cp -r dist/* /var/www/xavigate-frontend/

# Set proper permissions
sudo chown -R www-data:www-data /var/www/xavigate-frontend/
sudo chmod -R 755 /var/www/xavigate-frontend/

echo "✅ Frontend deployment complete!"
echo "🌐 Frontend available at https://chat.xavigate.com"
echo ""
echo "📊 Next steps:"
echo "1. Test the MN scores loading at https://chat.xavigate.com"
echo "2. Check console for debug messages"
echo "3. Verify scores display correctly without forcing retake"