# Stellar Notifier Docker

This project is a complete working example of how to use [stellar-notifier](https://github.com/orbitlens/stellar-notifier)

It sets up a front end website, a backend to listen to notifier, and stellar-notifier

To get everything up and running, simply:

```
$ docker-compose build
$ docker-compose up -d

# Stop Docker containers
$ docker-compose down
```

the ./mongo-db directory is docker volume for mongos data, delete it to reset db

Open [localhost:8084](http://localhost:8084) to get started.

Modify the docker-compose.yml to suit your needs and set the correct environment variables

### To run the testweb separately from docker, switch to the testweb dir and:

```
npm i
npm run serve
```

Open [localhost:8082](http://localhost:8082) to view ui.
