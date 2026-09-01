# ============================================
# Stage 1: Build React App
# ============================================
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files first for layer-cached install
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build with API URL pointing to /api (Nginx will proxy to backend)
ENV VITE_API_URL=/api
RUN npm run build

# ============================================
# Stage 2: Serve with Nginx
# ============================================
FROM nginx:alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
