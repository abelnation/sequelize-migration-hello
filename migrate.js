const child_process = require('child_process');
const Promise = require('bluebird');
const Sequelize = require('sequelize');
const Umzug = require('umzug');

const DB_TYPE = 'postgres';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;

const DB_NAME = 'sequelize_migration_demo';
const DB_USER = 'sequelize_demo_admin';
const DB_PASS = '';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_TYPE,

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
        sequelize: sequelize,
    },
    // see: https://github.com/sequelize/umzug/issues/17
    migrations: {
        params: [
            sequelize.getQueryInterface(),
            sequelize.constructor,
            function() {
                throw new Error('Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.');
            }
        ],
        path: './migrations',
        pattern: /\.js$/
    },

    logging: function() {
        console.log.apply(null, arguments);
    },
});

function logUmzugEvent(eventName) {
    return function(name, migration) {
        console.log(`${ name } ${ eventName }`);
    }
}
umzug.on('migrating', logUmzugEvent('migrating'));
umzug.on('migrated',  logUmzugEvent('migrated'));
umzug.on('reverting', logUmzugEvent('reverting'));
umzug.on('reverted',  logUmzugEvent('reverted'));

function cmdStatus() {
    return Promise.props({
        executed: umzug.executed(),
        pending: umzug.pending(),
    }).then(({ executed, pending }) => {

        const current = executed.length > 0 ? executed[0].file : '<NO_MIGRATIONS>';
        const status = {
            current: current,
            executed: executed.map(m => m.file),
            pending: pending.map(m => m.file),
        }

        console.log(JSON.stringify(status, null, 2))
    })
}

function cmdMigrate() {
    console.log('BEGINNING MIGRATION');
    return umzug.up()
        .then(migrations => {
            console.log('==============');
            console.log('MIGRATION DONE');
            console.log(JSON.stringify(migrations.map(m => m.file), null, 2));
        }).catch(err => {
            console.log('===============');
            console.log('MIGRATION ERROR');
            console.log(err)
        })
}

function cmdReset() {
    console.log('BEGINNING RESET');
    return umzug.down()
        .then(migrations => {
            console.log('==========');
            console.log('RESET DONE');
            console.log(JSON.stringify(migrations.map(m => m.file), null, 2));
        }).catch(err => {
            console.log('===========');
            console.log('RESET ERROR');
            console.log(err)
        })
}

function cmdHardReset() {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                child_process.spawnSync(`dropdb ${ DB_NAME }`);
                child_process.spawnSync(`createdb ${ DB_NAME } --username ${ DB_USER }`);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    });
}

const cmd = process.argv[2].trim();
switch(cmd) {
    case 'status':
        cmdStatus()
            .then(() => process.exit(0));
        break;

    case 'migrate':
        cmdStatus()
            .then(() => cmdMigrate())
            .then(() => process.exit(0))
        break;

    case 'reset':
        cmdReset()
            .then(() => process.exit(0))
        break;

    case 'hard-reset':
        cmdHardReset()
            .then(() => process.exit(0))
        break;

    default:
        console.log(`invalid cmd: ${ cmd }`);
}
