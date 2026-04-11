FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]