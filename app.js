const express = require("express");
const User = require("./models/User");

const app = express();

app.get("/", async(req, res) => {
    res.send("Hello")
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server is running..")
})