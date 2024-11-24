const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const BorrowedBooks = sequelize.define('BorrowedBooks', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user', 
      key: 'id',
    },
  },
  book_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'books', 
      key: 'id',
    },
  },
  borrowed_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  returned_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  },
}, {
  tableName: 'borrowed_books',
  timestamps: false,
  underscored: true, 
});

BorrowedBooks.associate = function(models) {
  BorrowedBooks.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user', 
  });
  BorrowedBooks.belongsTo(models.Book, {
    foreignKey: 'book_id',
    as: 'book', 
  });
  
};

module.exports = BorrowedBooks;
