const Promise = require('bluebird');

module.exports = {
    up: function(query, DataTypes) {
        return query.createTable('users', {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            firstName: {
                type: DataTypes.TEXT
            },
            lastName: {
                type: DataTypes.TEXT
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        });
    },

    down: function(query, DataTypes) {
        // return query.dropAllTables();
        return query.dropTable('users');
    }
};
