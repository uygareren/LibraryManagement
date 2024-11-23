const User = require("../models/User");
const BorrowedBooks = require("../models/BorrowedBooks");
const { Op } = require("sequelize");
const Book = require("../models/Book");


exports.GetUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: BorrowedBooks,
          as: 'borrowed_books',
          required: false,  
          where: {
            returned_at: { [Op.not]: null }, 
          },
          include: [
            {
              model: Book,
              as: 'book', 
              attributes: ['id', 'title'], 
            },
          ],
        },
        {
          model: BorrowedBooks,
          as: 'borrowing_books',
          required: false,  
          where: {
            returned_at: null,  
          },
          include: [
            {
              model: Book,
              as: 'book', 
              attributes: ['id', 'title'], 
            },
          ],
        },
      ],
    });

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

exports.GetUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: `User with ID ${userId} not found` });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

exports.PostUser = async (req, res) => {
    const {name} = req.body; 

    try {
        const newUser = await User.create({name});
        
        res.status(201).json({ message: 'User created successfully', user: newUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error inserting user' });
    }
}
