FROM node:18-alpine AS builder

WORKDIR /app
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/out ./out

EXPOSE 3000

CMD ["npm", "start"]