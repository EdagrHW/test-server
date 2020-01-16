const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Model extends Sequelize.Model{}
    Model.init({
        ip:{
            type: DataTypes.STRING,
        },
        port:{
            type: DataTypes.INTEGER,
        },
        email:{
            type: DataTypes.STRING,
            unique: true,
            valide: {
                isEmail: true
            }
        }
    },
    {
        sequelize,
        modelName: 'Endpoint'
    }
    )
    return Model;
}