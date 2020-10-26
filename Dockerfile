FROM node:alpine

RUN mkdir /chronicles_frontend
WORKDIR /chronicles_frontend

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]