module.exports = (sequelize, DataTypes) => {

    return sequelize.define('users', {
        firstName: {
            type: DataTypes.TEXT
            // type: DataTypes.STRING()
        },
        lastName: {
            type: DataTypes.TEXT
        }
    }, {
        freezeTableName: true,
    });

};
