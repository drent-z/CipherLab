#!/bin/bash

# CipherLab Setup Script
echo "Setting up CipherLab..."
echo "========================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js (version 14 or higher)."
    echo "Visit https://nodejs.org/ to download and install Node.js."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2)
NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d '.' -f 1)

if [ $NODE_MAJOR_VERSION -lt 14 ]; then
    echo "Node.js version 14 or higher is required. Your current version is $NODE_VERSION."
    echo "Please upgrade Node.js and try again."
    exit 1
fi

echo "Node.js version $NODE_VERSION detected. ✓"

# Install dependencies
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "Failed to install dependencies. Please check the error messages above."
    exit 1
fi

echo "Dependencies installed successfully. ✓"

# Start the development server
echo "========================="
echo "Setup complete! You can now start the development server with:"
echo "npm start"
echo ""
echo "Then open your browser and navigate to: http://localhost:8080"
echo "========================="

# Ask if user wants to start the server now
read -p "Would you like to start the development server now? (y/n): " START_SERVER

if [[ $START_SERVER == "y" || $START_SERVER == "Y" ]]; then
    echo "Starting development server..."
    npm start
else
    echo "You can start the server later by running 'npm start'"
fi
