# Gunakan image Node.js resmi
FROM node:22-alpine

# Atur working directory
WORKDIR /app

# Copy only built files and dependencies
COPY package*.json ./
COPY node_modules/ ./node_modules/
COPY .next/ .next/
COPY public/ ./public/
COPY next.config.ts ./
COPY tsconfig.json ./

# Gunakan port 3000
EXPOSE 3000

# Jalankan server Next.js
CMD ["npm", "start"]
