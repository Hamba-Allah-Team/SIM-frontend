# Gunakan image Node.js resmi
FROM node:18-alpine

# Atur working directory
WORKDIR /app

# Salin package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Salin semua file ke dalam container
COPY . .

# Build Next.js app
RUN npm run build

# Gunakan port 3000
EXPOSE 3000

# Jalankan server Next.js
CMD ["npm", "start"]
