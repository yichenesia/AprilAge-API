# Ollon Bedrock2020
A starter API using Nodejs with mysql.


# Spinning Up Server

This app uses dotenv.

You will need to copy example.env to .env and fill with your environment's variables. Alternatively, you can use environment variables (see env.sh.example)
```
cp example.env .env

```


Create an empty db in mysql, and add the Database info to .env
```
CREATE DATABASE bedrock_dev;

CREATE USER 'bedrock'@'localhost' IDENTIFIED BY '<password>';
GRANT ALL PRIVILEGES ON * . * TO 'bedrock'@'localhost';

```

Run migrations & seed.  Run Migrations and seeds to 
```

source .env
npm install
npm run localDeploy
npm run localResetSeeds

```

# Making new DB Migrations & Seeds
Make migrations and seeds
```
npm run makeMigration migrationName
```

```
npm run makeSeed seedName
```



# Start the application

```
npm start

```



# Docker

The back end will have two docker containers which are in the same network

##  Network
```
docker network create ollon-bedrock
```
## Database Container
The database will live in a standed mysql conatiner.  once it is up and running the standard database  setup above need to be run on it

```
docker run  --net ollon-bedrock --name ollon-bedrock-db  -p 3306:3306 -e MYSQL_ROOT_PASSWORD=<password> mysql:5.7

```
## API Container
The API coontaier is built with the docker file in the dirctory
Note docker does like quotations in .env files

```
docker build  -t ollon-bedrock .

docker run --env-file .env --network ollon-bedrock  --name ollon-bedrock  -p 3001:3001 ollon-bedrock 

```
## Useful Docker commands

Cleaning up 

```
docker rmi -f $(docker images -f "dangling=true" -q)

docker rm -f  <container_name>

```

Running a command on a running continer

```
docker exec -it ollon-bedrock  <command>

docker exec -it ollon-bedrock-db mysql -u root -p

```


# App Breakdown

## App.js
Main entrance app

## Config
in config/config.js
Config file to use process.env.API

## Routes
routes/index.js
routes/user.routes.js
routes/entry.routes.js - example routes. Modify as you please.
The http endpoints you can call
Route to controller

## Controllers
controllers
Handle a call
Returns the result

## Services
services
More detailed processes

## Models
models
Models for objects, generally model -> db table

## Middleware
Middleware for express routes




# TROUBLESHOOTING

1. ERROR: route not found on Windows
   If running on Windows, open config.js and set api*root_path to "/" and not to getEnv("API*
   ROOT_PATH") since this variable is used by Windows and the nodejs app will use the variable set by Windows and not from the env.sh
