# Use a lightweight Node runtime base image compatible with Node v24
FROM node:24-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy the rest of the application source code
COPY . .

# The actual entry ports are bound dynamic via orchestration at runtime
CMD ["node", "server.js"]