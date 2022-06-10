const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, allowNull:false,unique: true},
    firstName: {type: DataTypes.STRING, allowNull:false},
    lastName: {type: DataTypes.STRING, allowNull: false}, 
    image: {type: DataTypes.STRING}, 
    pdf: {type: DataTypes.BLOB} 
})

const UserDetails = sequelize.define('userDetails', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    password: {type: DataTypes.STRING, allowNull:false,unique: true}
})

User.hasOne(UserDetails, {as: 'userDetails',foreignKey: 'userId'})
UserDetails.belongsTo(User)

module.exports =  {User, UserDetails}