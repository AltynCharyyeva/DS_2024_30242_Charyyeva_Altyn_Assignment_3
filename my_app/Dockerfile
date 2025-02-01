# Use Node.js as the base image
FROM node:21.7.3
EXPOSE 3000

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the React app
RUN npm run build

# Install `serve` to serve the built app
RUN npm install -g serve

# Expose port 3000 to the host
EXPOSE 3000

# Command to serve the app on port 3000
CMD ["npm", "start"]
