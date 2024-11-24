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
    const user = await User.findByPk(userId, {
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

exports.BorrowBook = async (req, res, next) => {
  try {
    const { userId, bookId } = req.params;

    const isBorrowing = await BorrowedBooks.findOne({
      where: {
        user_id: userId,
        returned_at: null,
      },
    });

    if (isBorrowing) {
      return res
        .status(400)
        .json({ success: false, message: "You have already borrowed a book!" });
    }

    // Check the user 
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check the book
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    // Create the borrowing
    const newBorrowingBook = await BorrowedBooks.create({
      user_id: userId,
      book_id: bookId,
      borrowed_at: Date.now()
    });

    return res.status(201).json({
      success: true,
      message: "Book borrowed successfully!",
      data: newBorrowingBook,
    });

  } catch (error) {
    console.error("Error borrowing book:", error);
    next(error); 
  }
};

exports.ReturnBook = async (req, res, next) => {
  const { userId, bookId } = req.params;
  const {score} = req.body;

  try {

    if(score < 0 && score > 10){
      return res.status(400).json({ success: false, message: "Score must be between 0 and 10" });
    }

    const borrowedBook = await BorrowedBooks.findOne({
      where:{
        user_id:userId,
        book_id:bookId,
        returned_at:null
      }
    });

    if (!borrowedBook) {
      return res.status(404).json({ success: false, message: "No borrowed book found" });
    }

    borrowedBook.returned_at = Date.now();
    borrowedBook.score = score;

    await borrowedBook.save();

    return res.status(200).json({
      success: true,
      message: "Book returned successfully",
      data: borrowedBook,
    });

    
  } catch (error) {
    console.error("Error returning book:", error);
    next(error); 
  }
}
