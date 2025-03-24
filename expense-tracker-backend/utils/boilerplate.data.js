const verify_account_boilerplate = (otp, username) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Welcome, ${username}!</h2>
    <p>Thank you for registering. Please verify your account by using the following OTP:</p>
    <h3 style="color: #2e6c80;">${otp}</h3>
    <p>This OTP is valid for a limited time. If you did not request this, please ignore this email.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
`;

const reset_password_boilerplate = (otp, username) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Hello, ${username}!</h2>
    <p>We received a request to reset your password. Please use the following OTP to reset your password:</p>
    <h3 style="color: #2e6c80;">${otp}</h3>
    <p>This OTP is valid for 5 minutes. If you did not request a password reset, please ignore this email.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
`;

module.exports = { verify_account_boilerplate, reset_password_boilerplate };
