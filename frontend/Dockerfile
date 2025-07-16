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

# Cria um script de inicialização robusto para o container
RUN echo '#!/bin/bash\n\
\n\
# Inicia a aplicação Next.js em segundo plano com PM2\n\
pm2 start "npm run start" --name next-app\n\
\n\
# Inicia o Nginx em primeiro plano. Este comando manterá o container rodando.\n\
nginx -g "daemon off;"\n\
' > start_container.sh

# Garante que o script seja executável
RUN chmod +x start_container.sh

EXPOSE 80

# Define o ponto de entrada do container para executar o script de inicialização
CMD ["/bin/bash", "./start_container.sh"]