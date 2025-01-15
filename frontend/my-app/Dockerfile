# Use the official Node.js image as the base
FROM node:18
# Set the working directory inside the container
WORKDIR /app

# Install Nginx
RUN apt-get update && \
    apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/* && \
    # Remove the default Nginx configuration
    rm /etc/nginx/sites-enabled/default
# Remove the default Nginx configuration file
# RUN rm /etc/nginx/conf.d/default.conf

# Copy the Nginx configuration file from your project into the container
COPY nginx.conf /etc/nginx/conf.d
# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the app source code to the container
COPY . .
# VOLUME [ "/app/.next/static" ]

# Build the Next.js app
RUN npm run build

# Copy the updated start script to the container
COPY start.sh start.sh

# Make the start script executable
RUN chmod +x start.sh

 
# Expose the port Nginx is listening on
EXPOSE 80

# Run the start script to start Nginx and the Node.js app
CMD ["./start.sh"]
