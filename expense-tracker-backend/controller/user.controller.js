const mongoose = require("mongoose");
const User = require("../models/user.model");
const { StatusCodes } = require("http-status-codes");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../utils/authUtils");
const { generateOTP, sendVerificationEmail } = require("../utils/OTPUtils");

const path = require("path");

const registerUser = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const otp = generateOTP().otp;

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      otp,
      isVerified: false,
    });

    const savedUser = await newUser.save();

    // Send OTP via email
    await sendVerificationEmail(email, fullname, otp);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User Created Successfully. Please check your email for OTP verification.",
      data: {
        id: savedUser._id,
        fullname: savedUser.fullname,
        email: savedUser.email
      },
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error",
    });
  }
};


const verifyOTPUser = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    // Generate token for the verified user
    const token = generateToken(user);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "OTP verified successfully",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // If user does not exist
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // If user has not verified email
    if (!user.isVerified) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Please verify your account before logging in",
      });
    }

    // Compare the password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate and send OTP for login verification
    const otp = generateOTP().otp;
    user.otp = otp;
    await user.save();

    // Send OTP via email
    await sendVerificationEmail(email, user.fullname, otp);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "OTP sent to your email for login verification",
      email: user.email
    });

  } catch (error) {
    console.error("Error in login process:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error",
    });
  }
};

const verifyLoginOTP = async (req, res) => {
  const { email, otp } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Clear OTP after successful verification
    user.otp = null;
    await user.save();

    // Generate token for the verified user
    const token = generateToken(user);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Error verifying login OTP:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error",
    });
  }
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = generateOTP().otp;
    user.otp = otp;
    await user.save();

    await sendVerificationEmail(email, user.fullname, otp);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "OTP sent to your email for password reset",
    });

  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Step 2: Verify OTP & Reset Password
 */
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error",
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Data fetched Successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error",
    });
  }
};

const getUserById = async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `User with Id ${userId} was not found`,
    });
  }
  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Data Fetched successfully",
    data: user,
  });
};

// const getProfile = async (req, res, next) => {
//   const userId = req.user.userId;
//   try {
//     const user = await User.findById(userId)
//       .populate({
//         path: "appliedJobs.jobId",
//         select: "jobTitle",
//       })
//       .populate({
//         path: "savedJobs.jobId",
//         select: "jobTitle",
//       });
//     if (!user) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         success: false,
//         message: `User with Id ${userId} was not found`,
//       });
//     }
//     return res.status(StatusCodes.OK).json({
//       success: true,
//       message: "Data Fetched successfully",
//       data: {
//         fullName: user.fullName,
//         email: user.email,
//         profilePicture: user.profilePicture,
//       },
//     });
//   } catch (error) {
//     next(error);
//     console.log(error);
//   }
// };

module.exports = {
  registerUser,
  verifyOTPUser,
  loginUser,
  verifyLoginOTP,
  getAllUser,
  getUserById,
  requestPasswordReset,
  resetPassword,
  // getProfile,
};
