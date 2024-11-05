const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Notification = require("../models/notification");
const fs = require("fs");
const path = require("path");
const upload = require("../middleware/upload");
require("dotenv").config(); 
const jwtSecret = process.env.JWT_TOKEN_SECRET;

const axios = require("axios");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000)
    .toString()
    .substring(0, 4);
};

//Helper function to send OTP
const sendOTP = async (phone, otp) => {
  let phonenumber = String(phone);

  let otpval = String(otp);

  const baseUrl = "https://api.afromessage.com/api/send";
  // api token
  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJpZGVudGlmaWVyIjoiTjI4aWRHeGxLajN5a0VTQXlDNkpHTVdsMW9JVFc5VXUiLCJleHAiOjE4ODYxNTU0MjIsImlhdCI6MTcyODM4OTAyMiwianRpIjoiMWZiNTMwM2QtOWE2Mi00ZWM0LTgwYmItM2NkOGY0NmQzYjMyIn0.PmRcDqiQ9c0S3fo1_MV4tpDEUSJr8fN0wmR_1-3c_ig";
  // header
  const headers = { Authorization: "Bearer " + token };
  // request parameters
  const to = phonenumber;
  const message = `Your KGH app OTP is ${otpval} use this OTP to verify your account.`;
  const from = "e80ad9d8-adf3-463f-80f4-7c4b39f7f164";
  // final url
  const url = `${baseUrl}?from=${from}&to=${to}&message=${message}`;

  // make request
  axios
    .get(url, { headers })
    .then((response) => {
      // check result
      if (response.status === 200) {
        // request is success. inspect the json object for the value of `acknowledge`
        const json = response.data;
        if (json.acknowledge === "success") {
          // do success
          console.log("api success");
        } else {
          // do failure
          console.log("api error");
        }
      } else {
        // anything other than 200 goes here.
        console.log(
          `http error ... code: ${response.status}, msg: ${response.data}`
        );
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.resendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });
    if (user) {
            
        const otp = generateOTP();
        user.otp = otp;

        await user.save();
        await sendOTP(phone, otp);
        res.status(200).json({ message: "OTP sent for verification." });
      
    } else {
      console.log("hoooooooo");
      res.status(400).json({ message: "user not registered" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Registration
exports.signup = async (req, res) => {
  try {
    const userData = req.body.userData;
    const { phone } = userData;
    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      if (existingUser.verified) {
        return res.status(400).json({ error: "User already exists" });
      } else {
        try {
          await User.findByIdAndDelete(existingUser._id);
          console.log("User deleted successfully");
        } catch (error) {
          console.error("Failed to delete user:", error);
          return res.status(500).json({ error: "Failed to delete user" });
        }
      }
    }

    const user = new User(userData);
    const otp = generateOTP();
    user.otp = otp;
    if (req.body.image) {
      user.image = req.body.image;
    }

    await user.save();
    await sendOTP(phone, otp);
 
    const notification = new Notification({
      user_id: user._id,
      message: "Welcome to Kadisco General Hospital App. ENJOY",
    });

    await notification.save();
    console.log("User registered. OTP sent for verification.");
    return res
      .status(201)
      .json({ message: "User registered. OTP sent for verification." });
    
  } catch (error) {
    console.error("Failed to register user:", error);
    return res.status(400).json({ error: error.message });
  }
};


exports.updateImage = async (req, res) => {
  try {
    const userData = JSON.parse(req.body.userData);
    const { phone } = userData;
    const user = await User.findOne({ phone });
    if (user) {
      user.image = req.body.image;
      await user.save();
      res.status(200).json({
        message: "User image updated successfully.",
        newImage: req.body.image,
      });
    } else {
      res.status(400).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get image by id
exports.getImage = async (req, res) => {
  try {
    const imageId = req.params.imageId;
    const imagePath = path.join(__dirname, "..", "uploads/User Image", imageId);

    // console.log("Requested image ID:", imageId);
    // console.log("Image path:", imagePath);

    // Check if the image file exists
    if (!fs.existsSync(imagePath)) {
      console.log("Image not found in the uploads directory");
      return res.status(404).json({ message: "Image not found" });
    }

    // Serve the image file
    res.status(200).sendFile(imagePath);
  } catch (error) {
    console.log("Error details:", error);
    res
      .status(500)
      .json({ message: "Error retrieving image", error: error.message });
  }
};

// get user by id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// OTP verification
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    console.log(phone , otp);
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.otp === otp) {
      user.verified = true;
      user.otp = undefined;
      await user.save();
      console.log(user);
      const maxAge = 10 * 60 * 60 * 24;
      const token = jwt.sign({ user }, process.env.JWT_TOKEN_SECRET, {
        expiresIn: maxAge,
      });
      res.cookie("jwt", token);
      res.status(200).json({
        message: "OTP verified. User is now verified.",
        Token: token,
        user: user,
      });
    } else {
      res.status(400).json({ error: "Invalid OTP." });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.checkOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.otp === otp) {
      res.status(200).json({
        message: "OTP checked. otp is identical to the one sent through sms.",
      });
    } else {
      res.status(400).json({ error: "Invalid OTP." });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
      console.log("User not found.");
      return res.status(404).json({ error: "User not found." });    
    }

    if (!user.verified) {
      console.log("User not verified. Please verify your OTP first.")
      return res
        .status(404)
        .json({ error: "User not verified. Please verify your OTP first." });

    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password." });
    }
    const maxAge = 10 * 60 * 60 * 24;
    const token = jwt.sign({ user }, process.env.JWT_TOKEN_SECRET, {
      expiresIn: maxAge,
    });
    res.cookie("jwt", token);
    res.status(200).json({
      message: "Login Successful.",
      Token: token,
      user: user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  } else {
    res.status(400).json({ message: "Invalid Token" });
  }
};

//delete user by id


// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ error: "Invalid OTP." });
    }

    user.password = newPassword;
    user.otp = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
