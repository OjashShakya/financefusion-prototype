const mongoose = require("mongoose");
const User = require("../models/user.model");
const { StatusCodes } = require("http-status-codes");
const { hashPassword, comparePassword } = require("../utils/authUtils");
const cloudinary = require("../config/cloudinary");
const { generateOTP, sendVerificationEmail } = require("../utils/OTPUtils");

// Update user's email
const updateEmail = async (req, res) => {
  const { newEmail, password } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify password before allowing email change
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Check if new email already exists
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Email already in use",
      });
    }

    // Generate OTP for email verification
    const otp = generateOTP().otp;
    user.otp = otp;
    user.newEmail = newEmail; // Store new email temporarily
    await user.save();

    // Send verification email to new email address
    await sendVerificationEmail(newEmail, user.fullname, otp);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "OTP sent to new email for verification",
    });
  } catch (error) {
    console.error("Error updating email:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error",
    });
  }
};

// Verify new email with OTP
const verifyNewEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.newEmail) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "No email update pending",
      });
    }

    if (user.otp !== otp) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Update email and clear OTP and newEmail
    user.email = user.newEmail;
    user.otp = null;
    user.newEmail = null;
    await user.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Email updated successfully",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error verifying new email:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update user's password
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash and update new password
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error",
    });
  }
};

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  const userId = req.user.userId;

  try {
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_pictures",
      width: 300,
      crop: "scale",
    });

    // Delete old profile picture from Cloudinary if exists
    if (user.profilePicture && user.profilePicture.public_id) {
      await cloudinary.uploader.destroy(user.profilePicture.public_id);
    }

    // Update user's profile picture
    user.profilePicture = {
      public_id: result.public_id,
      url: result.secure_url,
    };
    await user.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Profile picture updated successfully",
      data: {
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  updateEmail,
  verifyNewEmail,
  updatePassword,
  uploadProfilePicture,
}; 