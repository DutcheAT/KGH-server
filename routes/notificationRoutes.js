const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const { userAuth } = require("../middleware/auth");
const notificationController = require("../controllers/notificationController");

router.use(cookieParser());

router.get('/fetch-notification',userAuth, notificationController.getNotifications);

module.exports = router;