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
        eyeColor: {
            type: DataTypes.ENUM('unspecified', 'green', 'blue', 'hazel'),
            defaultValue: 'unspecified',
            allowNull: false,
        }
    }, {
        freezeTableName: true,
    });

};
