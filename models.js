const sequelize = require('./db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING,unique: true},
    firstName: {type: DataTypes.STRING},
    lastName: {type: DataTypes.STRING}, 
    image: {type: DataTypes.STRING}, 
    pdf: {type: DataTypes.BLOB} 
})

module.exports = {User}