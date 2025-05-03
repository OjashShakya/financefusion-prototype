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
const authenticateUser = require("../middlewares/auth.middleware");
const upload = require("../middlewares/fileUpload.middleware");

const router = express.Router();

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

// router.get(
//   "/:id",
//   currentUser,
//   getUserById
// );



router.post(
  "/password-reset/request",
  requestPasswordReset
);  

router.post(
  "/password-reset/reset",
  resetPassword
);  


router.post(
  "/profile/:id/update-email",
  authenticateUser,
  updateEmail
);

router.post(
  "/profile/:id/verify-new-email",
  authenticateUser,
  verifyNewEmail
);

router.post(
  "/profile/:id/update-password",
  authenticateUser,
  updatePassword
);

router.post(
  "/profile/:id/upload-picture",
  authenticateUser,
  upload.single('profilePicture'),
  uploadProfilePicture
);


module.exports = router;
