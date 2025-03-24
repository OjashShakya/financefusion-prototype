const otpGenerator = require("otp-generator");
const { sendEmail } = require("./sendEmail");
const {
  verify_account_boilerplate,
  reset_password_boilerplate,
} = require("./boilerplate.data");

const generateOTP = () => {
  const otp = otpGenerator
    .generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    })
    .toString();

  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 5);
  return { otp, expiration };
};

const sendVerificationEmail = async (email, fullName, otp) => {
  const emailResponse = await sendEmail(
    email,
    verify_account_boilerplate(otp, fullName),
    "Verify Your Account"
  );
  return emailResponse;
};

const sendPasswordResetEmail = async (email, fullName, otp) => {
  const emailResponse = await sendEmail(
    email,
    reset_password_boilerplate(otp, fullName),
    "Password Reset OTP"
  );
  return emailResponse;
};

module.exports = {
  generateOTP,
  sendVerificationEmail,
  sendPasswordResetEmail,
};
