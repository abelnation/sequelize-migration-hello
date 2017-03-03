# sequelize-migration-hello
Testing of db migrations

## Description

This repo is a simple demo of a basic database migration.  It demonstrates the usage of
`Sequelize` and `Umzug` to perform database migrations along with the application code
changes that accompany the migration each step of the way.  The emphasis is on demonstrating
a database migration that can be applied while production code is running in the wild,
ensuring backwards compatibility each step of the way.

A simple web server is provided that allows you to interact with the app at each step
of the way via simple get/post requests with following endpoints:

- `GET  /users`: view all users
- `POST /users`: create a new user
- `GET  /users/dsql`: view sequelize description of users table
- `GET  /users/dpg`: view postgres description of users table

The repo demonstrates 5 steps.

1. Initial Setup (branch: `01-initial`)
2. DB: Add column with default value (branch: `02-addCol`)
3. App: Support column in data model, enforce validation (branch: `03-app-support-added`)
4. DB: Remove default value, require value (branch: `04-lock-down-db`)
5. App: Remove default value (branch: `05-lock-down-app`)

The repo comes with a helper script for executing migration steps: `migrate.js`.  It
supports the following commands:

- `status`: print current migration status
- `up/migrate`: executed all unexecuted migrations
- `down/reset`: revert all executed migrations
- `next/migrate-next`: execute the next pending migration
- `prev/reset-prev`: revert the previous executed migration
- `reset-hard`: reset the database using a `dropdb`/`createdb` postgres command

Execute a command via:

```shell
node ./migrate.js <command>
```

## Full demo flow

```shell
HOST="localhost:8080"
GET="curl -H "Content-Type: application/json" -X GET"
POST="curl -H "Content-Type: application/json" -X POST"

npm install

# start webserver
# will automatically restart when code changes
npm start

git checkout 01-initial
node ./migrate.js up

${GET} ${HOST}/users
${POST} ${HOST}/users -d '{"firstName":"Abel","lastName":"Allison"}'
${GET} ${HOST}/users
# Not supported yet
${POST} ${HOST}/users -d '{"firstName":"Abel","lastName":"Allison","eyeColor":"blue"}'

git checkout 02-addCol
node ./migrate.js up

# should see new column with default values
${GET} ${HOST}/users
# old app code still works, new column not yet supported
${POST} ${HOST}/users -d '{"firstName":"Abel","lastName":"Allison"}'
${POST} ${HOST}/users -d '{"firstName":"Abel","lastName":"Allison","eyeColor":"blue"}'

git checkout 03-app-support-added
node ./migrate.js up

# both verisons of add should now work
${POST} ${HOST}/users -d '{"firstName":"Abel","lastName":"Allison"}'
${POST} ${HOST}/users -d '{"firstName":"Abel","lastName":"Allison","eyeColor":"blue"}'

git checkout 04-lock-down-db
node ./migrate.js up

# both verisons of add should now work, db enforces not null and no default value
${POST} ${HOST}/users -d '{"firstName":"Abel","lastName":"Allison"}'
${POST} ${HOST}/users -d '{"firstName":"Abel","lastName":"Allison","eyeColor":"blue"}'

git checkout 05-lock-down-app
node ./migrate.js up

# old version of add now is forbidden
${POST} ${HOST}/users -d '{"firstName":"Abel","lastName":"Allison"}'
```

## Setup

```shell
# Create admin-user and db
createuser sequelize_demo_admin --createdb --superuser
createdb sequelize_migration_demo --username sequelize_demo_admin

# Verify works
psql -d sequelize_migration_demo -U sequelize_demo_admin
```
