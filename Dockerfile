# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copia apenas package.json primeiro para cache de dependências
COPY package*.json ./

# Usa npm ci para builds mais confiáveis e reproduzíveis
RUN npm ci

# Copia o resto do código
COPY . .

# Roda o build do Vite
RUN npm run build

# Production stage com Nginx
FROM nginx:alpine

# Copia os arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuração do Nginx para SPA (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

# Executa o Nginx em foreground
CMD ["nginx", "-g", "daemon off;"]
