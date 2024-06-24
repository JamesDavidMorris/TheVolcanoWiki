#!/bin/bash

# Build the frontend
cd Frontend
npm install
npm run build

# Move the build files to the backend's public directory
cd ..
rm -rf Backend/public
mv Frontend/build Backend/public

# Install backend dependencies
cd Backend
npm install