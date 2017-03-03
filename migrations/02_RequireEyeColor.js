const Promise = require('bluebird');

module.exports = {
    up: function(query, DataTypes) {
        return query.sequelize.query([
                `ALTER TABLE "users" ALTER COLUMN "eyeColor" SET NOT NULL;`,
                `ALTER TABLE "users" ALTER COLUMN "eyeColor" DROP DEFAULT;`
            ].join(''),
            { raw: true });
    },

    down: function(query, DataTypes) {
        return query.sequelize.query(
            [
                `ALTER TABLE "users" ALTER COLUMN "eyeColor" DROP NOT NULL;`,
                `ALTER TABLE "users" ALTER COLUMN "eyeColor" SET DEFAULT 'unspecified';`,
            ].join(''),
            { raw: true });
    }
};
