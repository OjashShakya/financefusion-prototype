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

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User Created Successfully",
      data: {
        id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        otp: savedUser.otp,
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

    res.status(StatusCodes.OK).json({
      success: true,
      message: "OTP verified successfully",
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

    // Generate token
    const token = generateToken(user);
    console.log("User Logged In Successfully",token);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "User Logged In Successfully",
      token,
    });

  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error",
    });
  }
};


// const updateProfile = async (req, res, next) => {
//   const userId = req.params.id;
//   const updatedData = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     console.log("Uploaded File:", req.file); // Check the uploaded file

//     let avatar = user.profilePicture;
//     const profileLocalPath = req.file?.path; // Access the uploaded file's path here

//     if (profileLocalPath) {
//       console.log("New profile picture path: ", profileLocalPath);
//       const cloudinaryResponse = await uploadOnCloudinary(profileLocalPath);
//       avatar = cloudinaryResponse?.secure_url || user.profilePicture;
//       if (!avatar) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//           success: false,
//           message: "Failed to upload profile picture",
//         });
//       }
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { ...updatedData, profilePicture: avatar },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     res.status(StatusCodes.OK).json({
//       success: true,
//       message: "User updated successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };

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
  // updateProfile,
  getAllUser,
  getUserById,
  // getProfile,
};
