const Promise = require('bluebird');

module.exports = {
    up: function(queryInterface, DataTypes) {
        return queryInterface.createTable('users', {
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

    down: function(queryInterface, DataTypes) {
        // return queryInterface.dropAllTables();
        return queryInterface.dropTable('user');
    }
};
