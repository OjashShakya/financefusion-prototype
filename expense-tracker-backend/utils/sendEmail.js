const nodemailer = require("nodemailer");

const sendEmail = async (email, html, subject, cc = [], bcc = []) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODE_MAILER_EMAIL,
      to: email,
      subject: subject,
      html: html,
      cc: cc,
      bcc: bcc,
    };

    const response = await transporter.sendMail(mailOptions);
    console.log("Email has been sent successfully");
    console.log(response);
    return { success: true, response: response };
  } catch (error) {
    console.log("Email could not be sent due to error: " + error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };
