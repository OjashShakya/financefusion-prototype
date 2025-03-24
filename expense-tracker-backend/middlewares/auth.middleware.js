const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { StatusCodes } = require("http-status-codes");

async function verifyToken(req, res, next) {
  let token = req.headers["authorization"];

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Token not provided" });
  }

  token = token.substring(7); // Remove 'Bearer ' prefix

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = data.userId;

    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "User not found" });
    }

    req.user = {
      userId: user._id,
      permissions: user.permissions,
      role: user.role,
      fullName: user.fullName,
      email: user.email,
    };

    req.decodedToken = data;

    next();
  } catch (err) {
    return res.status(StatusCodes.FORBIDDEN).json({ error: "Invalid token" });
  }
}

module.exports = verifyToken;
