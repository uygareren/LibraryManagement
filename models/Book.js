const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
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
    tableName: 'books',
    timestamps: false, 
    underscored: true 
});

Book.associate = function(models) {
  Book.hasMany(models.BorrowedBooks, {
    foreignKey: 'book_id',
    as: 'borrowed_books'  
  });
};

module.exports = Book;
