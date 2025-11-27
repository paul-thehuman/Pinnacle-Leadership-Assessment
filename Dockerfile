# Step 1: Build the app
FROM node:18-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Step 2: Serve the app using a lightweight server (nginx)
FROM nginx:alpine
# Copy the built files from the previous step
COPY --from=build /app/dist /usr/share/nginx/html

# Configure Nginx to use the PORT variable provided by Cloud Run
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf 2>/dev/null || :

# Create a default Nginx config that listens on the correct PORT
RUN echo 'server { \
    listen 8080; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
