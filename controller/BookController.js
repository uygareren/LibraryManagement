const Book = require("../models/Book");

exports.GetBooks = async (req, res) => {
    try {
      const books = await Book.findAll();
      if (books.length === 0) {
        return res.status(404).json({ message: 'No books found' });
      }
      res.status(200).json(books);
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