# Use a lightweight nginx image to serve static content
FROM nginx:1.21-alpine

# Copy the static website files to the nginx html directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# The default nginx command will start the server
CMD ["nginx", "-g", "daemon off;"]
