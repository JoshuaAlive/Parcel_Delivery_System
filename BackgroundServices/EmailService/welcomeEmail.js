const ejs = require("ejs");
require("dotenv").config();
const sendMail = require("../helpers/sendmail");
const User = require("../models/User");
const CryptoJS = require("crypto-js");

const SendWelcomeEmail = async (fullname, password, email) => {
  const users = await User.find({ status: 0 });
  if (users.length > 0) {
    for (let user of users) {
      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS
      );
      const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
      ejs.renderFile(
        "templates/welcome.ejs",
        {
          fullname: user.fullname,
          password: originalPassword,
          email: user.email,
        },
        async (error, data) => {
          let messageOption = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Welcome to DeliverIt",
            html: data,
          };

          try {
            sendMail(messageOption);
            await User.findByIdAndUpdate(user._id, { $set: { status: 1 } });
          } catch (error) {
            console.error("Error sending email:", error);
          }
        }
      );
    }
  }
};

module.exports = { SendWelcomeEmail };
