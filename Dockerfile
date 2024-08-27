# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /home/node/app

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install -g npm@10.8.2

RUN npm install

# Copy the rest of the application code
COPY . .

# Start your Express app
CMD ["npm", "start"]
