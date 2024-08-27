# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /home/node/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install && \
    npm cache clean --force

# Copy the rest of the application code
COPY . .

RUN npm run build

# Start your Express app
CMD ["npm", "start"]
