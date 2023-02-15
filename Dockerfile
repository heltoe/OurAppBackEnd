FROM node:18.12.1
WORKDIR /app
COPY package*.json ./
# RUN npm install --only=production
RUN npm install
COPY . .
RUN npm install typescript -g
RUN npm run build

CMD node dist/index.js