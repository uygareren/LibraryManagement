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