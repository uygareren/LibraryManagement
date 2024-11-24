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
              attributes: ['title'], 
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
              attributes: ['title'], 
            },
          ],
        },
      ],
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      created_at: user.created_at,
      updated_at: user.updated_at,
      borrowed_books: Array.isArray(user.borrowed_books) 
        ? user.borrowed_books.map((borrowedBook) => ({
            id: borrowedBook.id,
            user_id: borrowedBook.user_id,
            book_id: borrowedBook.book_id,
            book_title: borrowedBook.book ? borrowedBook.book.title : null,
            borrowed_at: borrowedBook.borrowed_at,
            returned_at: borrowedBook.returned_at,
            score: borrowedBook.score,
            created_at: borrowedBook.created_at,
            updated_at: borrowedBook.updated_at,
          }))
        : [],
      borrowing_books: Array.isArray(user.borrowing_books) 
        ? user.borrowing_books.map((borrowingBook) => ({
            id: borrowingBook.id,
            user_id: borrowingBook.user_id,
            book_id: borrowingBook.book_id,
            book_title: borrowingBook.book ? borrowingBook.book.title : null,
            borrowed_at: borrowingBook.borrowed_at,
            returned_at: borrowingBook.returned_at,
            score: borrowingBook.score,
            created_at: borrowingBook.created_at,
            updated_at: borrowingBook.updated_at,
          }))
        : [],
    }));

    if (formattedUsers.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json(formattedUsers);
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
              attributes: ['title'], // Only include the title
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
              attributes: ['title'], // Only include the title
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: `User with ID ${userId} not found` });
    }

    const formattedUser = {
      id: user.id,
      name: user.name,
      created_at: user.created_at,
      updated_at: user.updated_at,
      borrowed_books: Array.isArray(user.borrowed_books)
        ? user.borrowed_books.map((borrowedBook) => ({
            id: borrowedBook.id,
            user_id: borrowedBook.user_id,
            book_id: borrowedBook.book_id,
            book_title: borrowedBook.book ? borrowedBook.book.title : null,
            borrowed_at: borrowedBook.borrowed_at,
            returned_at: borrowedBook.returned_at,
            score: borrowedBook.score,
            created_at: borrowedBook.created_at,
            updated_at: borrowedBook.updated_at,
          }))
        : [],
      borrowing_books: Array.isArray(user.borrowing_books)
        ? user.borrowing_books.map((borrowingBook) => ({
            id: borrowingBook.id,
            user_id: borrowingBook.user_id,
            book_id: borrowingBook.book_id,
            book_title: borrowingBook.book ? borrowingBook.book.title : null,
            borrowed_at: borrowingBook.borrowed_at,
            returned_at: borrowingBook.returned_at,
            score: borrowingBook.score,
            created_at: borrowingBook.created_at,
            updated_at: borrowingBook.updated_at,
          }))
        : [],
    };

    res.status(200).json(formattedUser);
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
