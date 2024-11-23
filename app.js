const express = require("express");
require("dotenv").config();
// ROUTES
const userRoutes = require("./route/UserRoutes");
const bookRoutes = require("./route/BookRoutes");

const app = express();

app.use(express.json()); 

app.use("/users", userRoutes); 
app.use("/books", bookRoutes); 

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
