const { Op, fn, col } = require("sequelize");
const Book = require("../models/Book");
const BorrowedBooks = require("../models/BorrowedBooks");

exports.GetBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [
        {
          model: BorrowedBooks,
          as: 'books',
          required: false,
          where: {
            returned_at: { [Op.not]: null }, 
          },
          attributes: [],  
        },
      ],
      attributes: {
        include: [
          [
            fn('AVG', col('books.score')), 
            'score',  
          ],
        ],
      },
      group: ['Book.id'], 
    });

    if (books.length == 0) {
      return res.status(404).json({ message: 'No books found' });
    }

    const result = books.map(book => {
      const bookData = book.toJSON();
      bookData.books = undefined; 

      if (bookData.score !== null) {
        bookData.score = parseFloat(bookData.score).toFixed(2);
      }

      return bookData;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching books' });
  }
};

exports.GetBookById = async (req, res) => {
    const {bookId} = req.params;

    try {
      const book = await Book.findByPk(bookId);
      if (!book) {
        return res.status(404).json({ message: `Book with ID ${bookId} not found` });
      }
      res.status(200).json(book);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching book' });
    }
};

exports.PostBook = async(req, res) => {
    const {name} = req.body; 

    try {
        const newBook = await Book.create({title: name});
        
        res.status(201).json({ message: 'Book created successfully', book: newBook });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error inserting book' });
    }
}