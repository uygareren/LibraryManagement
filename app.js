require("dotenv").config();
const express = require("express");

// Models imported
const BorrowedBooks = require("./models/BorrowedBooks");
const User = require("./models/User");
const Book = require("./models/Book");

// Import Routes
const userRoutes = require("./route/UserRoutes");
const bookRoutes = require("./route/BookRoutes");


User.associate({ BorrowedBooks });  
Book.associate({ BorrowedBooks });  
BorrowedBooks.associate({ User, Book });

const app = express();
app.use(express.json());

app.use("/users", userRoutes); 
app.use("/books", bookRoutes); 

app.use((err, req, res, next) => {
    console.error(err.stack);  
    res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
