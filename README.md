# sequelize-migration-hello
Testing of db migrations

## Description

This repo is a simple demo of a basic database migration.  It demonstrates the usage of
`Sequelize` and `Umzug` to perform database migrations along with the application code
changes that accompany the migration each step of the way.  The emphasis is on demonstrating
a database migration that can be applied while production code is running in the wild,
ensuring backwards compatibility each step of the way.

The repo demonstrates 5 steps.

1) Initial Setup (branch: `01-initial`)
2) DB: Add column with default value (branch: `02-addCol`)
3) App: Support column in data model, enforce validation (branch: `03-app-support-added`)
4) DB: Remove default value, require value (branch: `04-lock-down-db`)
5) App: Remove default value (branch: `05-lock-down-app`)

The repo comes with a helper script for executing migration steps: `migrate.js`.  It
supports the following commands:

- `status`: print current migration status
- `up/migrate`: executed all unexecuted migrations
- `down/reset`: revert all executed migrations
- `next/migrate-next`: execute the next pending migration
- `prev/reset-prev`: revert the previous executed migration
- `reset-hard`: reset the database using a `dropdb`/`createdb` postgres command

Execute a command via:

```
node ./migrate.js <command>
```

## Setup

```
# Create admin-user and db
createuser sequelize_demo_admin --createdb --superuser
createdb sequelize_migration_demo --username sequelize_demo_admin

# Verify works
psql -d sequelize_migration_demo -U sequelize_demo_admin
```
