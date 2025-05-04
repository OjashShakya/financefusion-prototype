const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  verifyOTPUser,
  verifyLoginOTP,
  getUser,
  updateUser,
  deleteUser,
} = require("../controller/user.controller");
const { authenticateUser } = require("../middleware/auth");

// Public routes
router.post("/register", registerUser);
router.post("/verify-otp", verifyOTPUser);
router.post("/login", loginUser);
router.post("/verify-login-otp", verifyLoginOTP);

// Protected routes
router.get("/profile", authenticateUser, getUser);
router.put("/profile", authenticateUser, updateUser);
router.delete("/profile", authenticateUser, deleteUser);

module.exports = router; 