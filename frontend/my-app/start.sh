#!/bin/bash

# Exit on any error
set -e

# Start the Node.js application in the background
echo "Starting Node.js application..."
npm start &

# Start Nginx in the foreground
echo "Starting Nginx..."
nginx -g 'daemon off;'
