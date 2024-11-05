const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); 
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
require('dotenv').config();
const cors = require('cors');
  

const app = express();

// Connect Database
connectDB();


app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Middleware

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
