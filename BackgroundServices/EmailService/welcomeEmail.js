const ejs = require("ejs");
require("dotenv").config();
const sendMail = require("../helpers/sendMail");
const User = require("../models/User");
const CryptoJs = require("crypto-js");

const sendWelcomeEmail = async () => {
  const users = await User.find({ status: 0 });
  if (users.length > 0) {
    for (let user of users) {
      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS
      );
      const originalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
      ejs.renderFile(
        "templates/welcome.ejs",
        {
          fullname: user.fullname,
          password: originalPassword,
          email: user.email,
        },
        async (err, info) => {
          let messageOption = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Welcome to DeliverIt",
            html: info,
          };

          try {
            sendMail(messageOption);
            await User.findByIdAndUpdate(user._id, { $set: { status: 1 } });
          } catch (error) {
            console.error(error);
          }
        }
      );
    }
  }
};

module.exports = { sendWelcomeEmail };
