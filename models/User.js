const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const BorrowedBooks = require('./BorrowedBooks');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user', 
  timestamps: false,
  underscored: true, 
});

User.associate = function(models) {
  User.hasMany(models.BorrowedBooks, {
    foreignKey: 'user_id',
    as: 'borrowed_books'
  });
  User.hasOne(models.BorrowedBooks, { 
    foreignKey: 'user_id', 
    as: 'borrowing_books' 
  });

};



module.exports = User;
