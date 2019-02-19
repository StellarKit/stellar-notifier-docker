FROM node:stretch

COPY . /

RUN npm install

# sets the server to use docker networking (see main docker-compose.yml)
RUN echo "\n ServerConfig.useDocker()" >> /config.js

CMD ["npm", "run", "start"]
