# Use Node.js 22 base image
FROM node:22

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json first
COPY package*.json ./

# Clean npm cache before installing dependencies
RUN npm cache clean --force

# Install production dependencies
RUN npm install --production

# Copy the rest of your application code
COPY . .

# Set environment variable
ENV PORT=3002

# Expose the port your app runs on
EXPOSE 3002

# Start the application
CMD ["npm", "start"]
