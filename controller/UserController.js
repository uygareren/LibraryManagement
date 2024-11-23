const User = require("../models/User");

exports.GetUser = async(req, res) => {
    try {
        const users = await User.findAll(); 
        res.status(200).json(users); 
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
      }
}