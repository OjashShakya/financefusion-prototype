const express = require("express");
const {
  registerUser,
  loginUser,
  verifyOTPUser,
  getAllUser,
  getUserById,
  requestPasswordReset,
  resetPassword,
  
} = require("../controller/user.controller");
const { validate } = require("../middlewares/validation.middleware");
const { signupSchema } = require("../validations/ZodValidation.user");
const { currentUser } = require("../controller/decodeToken.controller");
// const verifyToken = require("../middlewares/auth.middleware");
const authenticateUser = require("../middlewares/auth.middleware");
// const { profileUpload } = require("../middlewares/fileUpload.middleware");

const router = express.Router();

// router.get("/profile",verifyToken, getProfile);

router.post(
  "/register",
  validate(signupSchema),
  registerUser
);

router.post(
  "/login",
  loginUser
);

router.post(
  "/verify-otp",
  verifyOTPUser
);

router.get(
  "/",
  authenticateUser,
  getAllUser
);

router.get(
  "/:id",
  currentUser,
  getUserById
);

// router.get("/current-user", verifyToken);

router.post(
  "/password-reset/request",
  requestPasswordReset
);  // Request password reset (send OTP/link)

router.post(
  "/password-reset/reset",
  resetPassword
);  // Reset password with token/OTP

// router.patch(
//   "/update/:id",
//   verifyToken,
//   updateProfile, 
//   //  profileUpload.single("profilePicture"),
// );

module.exports = router;
