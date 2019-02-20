# Stellar Notifier Docker

```
$ docker-compose build
$ docker-compose up -d

# Stop Docker containers
$ docker-compose down
```

the ./mongo-db directory is docker volume for mongos data, delete it to reset db

Open [localhost:8084](http://localhost:8084) to get started.

To run the testweb separately from docker, switch to testweb dir and:

```
npm i
npm run serve
```

Open [localhost:8084](http://localhost:8082) to view ui.
