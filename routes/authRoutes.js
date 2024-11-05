//const express = require("express");
const authController = require("../controllers/authController");
const cookieParser = require("cookie-parser");
const { userAuth } = require("../middleware/auth");
const { uploadUserImage } = require("../middleware/upload");
const uploadImage = require("../middleware/image");
const express = require('express');
 
const router = express.Router();

//const router = express.Router();
router.use(cookieParser());



/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API endpoints for Authentication and Users
 */


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Create new user
 *     description: Create new user with userData attributes and upload an image file.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userData:
 *                 type: object
 *                 description: The user data attributes as a JSON object.
 *                 example:
 *                   first_name: "John"
 *                   last_name: "Doe"
 *                   email: "john.doe@example.com"
 *                   password: "your_secure_password"
 *                   phone: "+2519--------"
 *                 required:
 *                   - first_name
 *                   - last_name
 *                   - password
 *                   - phone
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload.
 *     responses:
 *       '201':
 *         description: OK. Returns a message that says "User registered. OTP sent for verification.".
 *         content:
 *           application/json:
 *             schema:
 *               $ref: './models/User' # Update reference to your user model
 *       '400':
 *         description: Bad Request. Invalid request body or missing attributes.
 */
//register a user respond with 201 status and a message if successful the key for image is "image" and user data "userData" important when sending request
router.post(
  "/signup",
  uploadUserImage.single("image"),
  uploadImage,
  authController.signup,
);

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: verify otp
 *     description: verify the otp sent to the user's phone.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: The user's phone number.
 *               otp:
 *                 type: string
 *                 description: The otp sent in sms.
 *     responses:
 *       '200':
 *         description: OTP verified. User is now verified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 token:
 *                   type: string
 *                   description: Authentication token.
 *                 user:
 *                   type: object
 *                   description: User object.
 *                   $ref: './models/User'
 *       '400':
 *         description: Invalid OTP.
 */
//inpute phone and otp and returns 200 status a message
router.post("/verify", authController.verifyOTP);

/**
 * @swagger
 * /api/auth/resetPassword:
 *   post:
 *     summary: reset password
 *     description: change the password of a user.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: The user's phone number.
 *               otp:
 *                 type: string
 *                 description: The otp sent in sms.
 *               password:
 *                 type: string
 *                 description: The new password.
 *     responses:
 *       '200':
 *         description: user password changed succesfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *       '400':
 *         description: Invalid OTP.
 */
//inpute phone, otp and password and returns 200 status a message, a Token and a user object
router.post("/resetPassword", authController.resetPassword);

/**
 * @swagger
 * /api/auth/checkOtp:
 *   post:
 *     summary: check otp
 *     description: check the otp sent to the user's phone.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: The user's phone number.
 *               otp:
 *                 type: string
 *                 description: The otp sent in sms.
 *     responses:
 *       '200':
 *         description: The otp is identical to the one sent through sms.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *       '400':
 *         description: Invalid OTP.
 */
//inpute phone and otp and returns 200 status a message, a Token and a user object
router.post("/checkOtp", authController.checkOTP);

//inpute id and returns 200 status with a user
router.get("/user/:id", authController.getUserById);



/**
 * @swagger
 * /api/auth/sendotp:
 *   post:
 *     summary: send otp
 *     description: send otp using the users phone.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: The user's phone number.
 *     responses:
 *       '200':
 *         description: OTP sent for verification..
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *       '400':
 *         description: "user not registered." 
 */
//inpute phone and returns 200 status and a message
router.post("/sendotp", authController.resendOtp);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and generate a token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: The user data attributes as a JSON object.
 *             example:
 *               phone: "+2519--------"
 *               password: "your_secure_password"
 *             required:
 *               - phone
 *               - password
 *     responses:
 *       '200':
 *         description: OK. User login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 token:
 *                   type: string
 *                   description: Authentication token.
 *                 user:
 *                   type: object
 *                   description: User object.
 *                   $ref: './models/User'
 *       '401':
 *         description: Unauthorized. Invalid credentials.
 */

//inpute phone and password and returns 200 status a message, a Token and a user_id
router.post("/login", authController.login);

router.post("/resendOTP", authController.resendOtp);
/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: User logout
 *     description: Log out the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     tags: [Auth]
 *     responses:
 *       '200':
 *         description: OK. User logged out successfully.
 *       '401':
 *         description: Unauthorized. User authentication failed.
 */

//logs out but does nothing really
router.get("/logout", authController.logout);



/**
 * @swagger
 * /api/auth/Image/{imageId}:
 *   get:
 *     summary: Get image of the user
 *     description: Retrieve an image using it's name.
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user.
 *     responses:
 *       '200':
 *         description: OK. Returns the image of the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: './models/User'
 *       '404':
 *         description: Not Found. The user with the specified ID was not found.
 */
//get image using it's name
router.get("/Image/:imageId", authController.getImage);

//update user image the key for image is "image" and user data "userData" important when sending request
router.post(
  "/updateImage",
  uploadUserImage.single("image"),
  uploadImage,
  authController.updateImage
);

module.exports = router;
