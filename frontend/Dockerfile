FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Runner com PM2 + NGINX
FROM node:18 AS runner

# Instala nginx e pm2
RUN apt-get update && apt-get install -y nginx && npm install -g pm2

WORKDIR /app
COPY --from=builder /app .

# Copia config do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Cria script do PM2
RUN echo 'pm2 start "npm run start" --name next-app && tail -f /dev/null' > start.sh
RUN chmod +x start.sh

EXPOSE 80
CMD service nginx start && ./start.sh
