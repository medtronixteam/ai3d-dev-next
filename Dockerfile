FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-depsRUN npm install @rollup/rollup-linux-x64-musl
COPY . .
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Add custom config (you must have nginx.conf in project root)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ✅ Correct this line for Vite (dist folder)
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
