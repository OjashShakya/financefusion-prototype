const express = require("express");
const {
  registerUser,
  loginUser,
  verifyOTPUser,
  getAllUser,
  getUserById,
  // updateProfile,
  // getProfile,
} = require("../controller/user.controller");

// const ZodUserSchema = require("../validations/user.validations");
// const validationMiddleware = require("../middlewares/validation.middleware");
const verifyToken = require("../middlewares/auth.middleware");
// const { profileUpload } = require("../middlewares/fileUpload.middleware");




const router = express.Router();

// router.get("/profile",verifyToken, getProfile);

router.post(
  "/register",
  registerUser
);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTPUser);

router.get(
  "/",
  verifyToken,
  getAllUser
);
router.get(
  "/:id",
  verifyToken,
  getUserById
);
// router.patch(
//   "/update/:id",
//   verifyToken,
//   updateProfile, 
//   //  profileUpload.single("profilePicture"),
// );


module.exports = router;
