FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

ENV DATABASE_URL="dummy"
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]