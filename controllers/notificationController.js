const Notification = require("../models/notification");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const jwtSecret = process.env.JWT_TOKEN_SECRET;


exports.getNotifications = async (req, res) => {
  try {
    let token = null;
   const authHeader = req.headers.authorization;
  if(authHeader){
   token = authHeader.split(' ')[1];
  }else{
   token = req.cookies.jwt;
  }
    console.log(token);
    const decoded = jwt.verify(token, jwtSecret);
    const userId = decoded.user._id;
    const notification= await Notification.find({ user_id: userId });
    if (!notification) {
      return res.status(404).json({ message: "Farm not found" });
    }
    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};