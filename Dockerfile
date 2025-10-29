# Use Node.js base image
FROM node:18

# Create app directory inside container
WORKDIR /app

# Copy package.json and package-lock.json (if any)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your project files
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start your server
CMD ["node", "server.js"]
