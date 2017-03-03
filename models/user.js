module.exports = (sequelize, DataTypes) => {

    return sequelize.define('users', {
        firstName: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
    });

};
