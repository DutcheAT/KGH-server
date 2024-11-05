const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const jwtSecret = process.env.JWT_TOKEN_SECRET;

exports.userAuth = (req, res, next) => {
  let token = null;
   const authHeader = req.headers.authorization;
  if(authHeader){
   token = authHeader.split(' ')[1];
  }else{
   token = req.cookies.jwt;
  }
  console.log(token);
  
  if (token) {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded?.user; // Use optional chaining operator
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

exports.superAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized: Missing authorization header' });
    }
    // console.log("creating...1");

    // Extract token from the header (assuming 'Bearer' schema)
    const token = authHeader.split(' ')[1]; // Split on space and get second element
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Invalid authorization header' });
    }
  
  else{
    try {
      const decoded = jwt.verify(token, jwtSecret);
      if(decoded?.admin.role == "Super Admin"){
      req.admin = decoded?.admin; // Use optional chaining operator
      next();} else {
        return res.status(401).json({ message: 'Unauthorized: Invalid authorization header' });
      }
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } 
};

exports.adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized: Missing authorization header' });
    }
    // console.log("creating...1");

    // Extract token from the header (assuming 'Bearer' schema)
    const token = authHeader.split(' ')[1]; // Split on space and get second element
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Invalid authorization header' });
    }
  
  else{
    try {
      const decoded = jwt.verify(token, jwtSecret);
      if(decoded?.admin.role == "Admin"){
      req.admin = decoded?.admin; // Use optional chaining operator
      next();} else {
        return res.status(401).json({ message: 'Unauthorized: Invalid authorization header' });
      }
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } 
};

exports.superAndAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized: Missing authorization header' });
    }
    // console.log("creating...1");

    // Extract token from the header (assuming 'Bearer' schema)
    const token = authHeader.split(' ')[1]; // Split on space and get second element
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Invalid authorization header' });
    }
  
  else{
    try {
      const decoded = jwt.verify(token, jwtSecret);
      if(decoded?.admin.role == "Admin" || decoded?.admin.role == "Super Admin"){
      req.admin = decoded?.admin; // Use optional chaining operator
      next();} else {
        return res.status(401).json({ message: 'Unauthorized: Invalid authorization header' });
      }
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } 
};
