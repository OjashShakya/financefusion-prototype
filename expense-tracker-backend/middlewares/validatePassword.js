const validatePassword = (req, res, next) => {
  const { password, newPassword } = req.body;
  const passwordToValidate = password || newPassword;

  if (!passwordToValidate) {
    return res.status(400).json({
      success: false,
      message: "Password is required"
    });
  }

  const minLength = 8;
  const hasNumber = /\d/.test(passwordToValidate);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(passwordToValidate);

  if (passwordToValidate.length < minLength) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long"
    });
  }

  if (!hasNumber) {
    return res.status(400).json({
      success: false,
      message: "Password must contain at least one number"
    });
  }

  if (!hasSymbol) {
    return res.status(400).json({
      success: false,
      message: "Password must contain at least one symbol"
    });
  }

  next();
};

module.exports = validatePassword; 