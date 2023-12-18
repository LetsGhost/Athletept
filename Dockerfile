# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Install required packages
RUN apk update && \
    apk add --no-cache chromium && \
    rm -rf /var/cache/apk/*

# Set environment variable to use puppeteer-core
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

# Set the working directory inside the container
WORKDIR /home/node/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install && \
    npm cache clean --force

# Copy the rest of the application code
COPY . .

# Start your Express app
CMD ["npm", "start"]
