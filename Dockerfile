FROM node:10.16-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . . 

EXPOSE 5555

CMD ["npm", "run", "dev"] 