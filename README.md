# Backend – nooro-task-app-be

---

## Tech

Express — ^5.1.0

Prisma -  ^16.14.0

MySQL - 8.4.1

TypeScript - ^5.9.2

___________________________________


## Environment

Make a .env file 

Fill in with the following values:

DATABASE_URL="mysql://task-app:noorochallenge@127.0.0.1:3306/tasks"
SHADOW_DATABASE_URL="mysql://root:root@127.0.0.1:3306/tasks"
CORS_ORIGIN="http://localhost:3000"

___________________________________


## Docker DB setup (recommended)

docker compose up -d

yarn install

npx prisma migrate dev --name init

yarn dev


## Manual DB setup

If not using docker, install MySQL 8 locally and run:

CREATE DATABASE tasks;
CREATE USER 'task-app'@'%' IDENTIFIED BY 'noorochallenge';
GRANT ALL PRIVILEGES ON tasks.* TO 'task-app'@'%';
FLUSH PRIVILEGES;

__________________________________________________________________________


## Endpoints and Testing

### /health

- Health check

  curl http://localhost:4001/health


### GET /tasks

- Retrieves all tasks sorted by date 

  curl http://localhost:4001/tasks


### POST /tasks 

- Creates a new task

  curl -X POST http://localhost:4001/tasks \
    -H "Content-Type: application/json" \
    -d '{"title":"First task","color":"#007AFF"}'


### PUT /tasks/:id

- Edit a task by id

  curl -X PUT http://localhost:4001/tasks/1 \
    -H "Content-Type: application/json" \
    -d '{"completed": true}'


### DELETE /tasks/:id

- Deletes a task by id

  curl -X DELETE http://localhost:4001/tasks/1

