# sequelize-migration-hello
Testing of db migrations

```
# Create admin-user and db
createuser sequelize_demo_admin --createdb --superuser
createdb sequelize_migration_demo --username sequelize_demo_admin

# Verify works
psql -d sequelize_migration_demo -U sequelize_demo_admin
```
