FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ARG NEXT_PUBLIC_API_URL

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} npm run build -- --no-lint

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/tsconfig.json ./ 

EXPOSE 3000

CMD ["npm", "start"]
