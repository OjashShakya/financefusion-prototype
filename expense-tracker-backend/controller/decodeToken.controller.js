const { StatusCodes } = require("http-status-codes");

const currentUser = (req, res) => {
  res.status(StatusCodes.OK).json({
    message: "Token decoded successfully",
    decodedToken: req.decodedToken,
  });
};

module.exports = { currentUser };
