# Use official Node.js 20 LTS image
FROM node:20-alpine

# Install git (Node image uses Debian base)
# RUN apt-get update && apt-get install -y git / curl

# Set working directory inside the container
WORKDIR /clone-jira-backend

# Copy package.json and package-lock.json (if any)
COPY package*.json ./

# Install dependencies
RUN npm install

#PM2 là một process manager 
RUN npm install -g pm2

# Copy the rest of your application
COPY . .

# Generate DB prisma
RUN npm run db:generate
#Build the application
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Start the app
CMD ["pm2-runtime", "dist/main.js", "--name", "jira-be"]
