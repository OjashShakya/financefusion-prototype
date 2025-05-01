const express = require("express");
const {
  registerUser,
  loginUser,
  verifyOTPUser,
  verifyLoginOTP,
  getAllUser,
  getUserById,
  requestPasswordReset,
  resetPassword,
} = require("../controller/user.controller");
const {
  updateEmail,
  verifyNewEmail,
  updatePassword,
  uploadProfilePicture,
} = require("../controller/profile.controller");
const { validate } = require("../middlewares/validation.middleware");
const { signupSchema } = require("../validations/ZodValidation.user");
const { currentUser } = require("../controller/decodeToken.controller");
// const verifyToken = require("../middlewares/auth.middleware");
const authenticateUser = require("../middlewares/auth.middleware");
const upload = require("../middlewares/fileUpload.middleware");
const { StatusCodes } = require("http-status-codes");

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

router.post(
  "/verify-login-otp",
  verifyLoginOTP
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

// Profile routes
router.post(
  "/profile/:id/update-email",
  authenticateUser,
  (req, res, next) => {
    if (req.params.id !== req.user.userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "You can only update your own profile"
      });
    }
    next();
  },
  updateEmail
);

router.post(
  "/profile/:id/verify-new-email",
  authenticateUser,
  (req, res, next) => {
    if (req.params.id !== req.user.userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "You can only verify your own email"
      });
    }
    next();
  },
  verifyNewEmail
);

router.post(
  "/profile/:id/update-password",
  authenticateUser,
  (req, res, next) => {
    if (req.params.id !== req.user.userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "You can only update your own password"
      });
    }
    next();
  },
  updatePassword
);

router.post(
  "/profile/:id/upload-picture",
  authenticateUser,
  (req, res, next) => {
    if (req.params.id !== req.user.userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "You can only update your own profile picture"
      });
    }
    next();
  },
  upload.single('profilePicture'),
  uploadProfilePicture
);


module.exports = router;
