const path = require('path');

function importModel(sequelize, importPath) {
    return sequelize.import(path.resolve(__dirname, importPath));
}

module.exports = function getModels(sequelize) {
    return {
        User: importModel(sequelize, './user'),
    }
}
