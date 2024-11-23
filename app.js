const express = require("express");
require("dotenv").config();
// ROUTES
const userRoutes = require("./route/UserRoutes");

const app = express();

app.use(express.json()); 

app.use("/", userRoutes); 

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
