# Base image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy the entire project to the working directory
COPY . .

# Install dependencies
RUN npm ci

# Build the React app
RUN npm run build

# Expose the port on which the React app will run (default is 3000)
EXPOSE 3000

# Set the command to run when the container starts
CMD ["npx", "serve", "-s", "build"]