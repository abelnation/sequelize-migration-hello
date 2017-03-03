const _ = require('lodash');
const express = require('express');
const Sequelize = require('sequelize');
const BodyParser = require('body-parser');

const getModels = require('./models');

const PORT = process.env.PORT || 8080;

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

const app = express();
const models = getModels(sequelize);

function respondOk(res, body) {
    res.status(200).json(body);
}

function respondError(res, err) {
    res.status(500).json({
        error: err,
    });
}

function describeSequelizeModel(modelName) {
    const model = models[modelName];
    if (!model) {
        respondError(res, new Error(`Invalid modelName: ${ modelName }`))
    }
    return (req, res) => {
        const attrs = _.reduce(model.rawAttributes, (result, attr, name) => {
            result[name] = {
                type: '' + attr.type,
            };
            return result;
        }, {});
        respondOk(res, attrs);
    }
}

function describePostgresModel(modelName) {
    const model = models[modelName];
    if (!model) {
        respondError(res, new Error(`Invalid modelName: ${ modelName }`))
    }
    return (req, res) => {
        model.describe().then(desc => {
            respondOk(res, desc);
        }).catch(err => {
            respondError(res, err);
        })
    }
}

// middleware

app.use(BodyParser.json());

// routes
app.get('/test', (req, res) => {
    respondOk(res, { response: 'ok' });
});

app.get('/users', (req, res) => {
    models.User.findAll().then(users => {
        respondOk(res, {
            users: users
        });
    }).catch(err => {
        respondError(res, err)
    })
});
app.post('/users', (req, res) => {
    const user = models.User.build(req.body);
    user.save().then(() => {
        respondOk(res, user);
    }).catch(err => {
        respondError(res, err);
    })
})
app.get('/users/dsql', describeSequelizeModel('User'))
app.get('/users/dpg', describePostgresModel('User'))

app.listen(PORT, function() {
	console.log(`test server listening on port ${ PORT }`);
});
