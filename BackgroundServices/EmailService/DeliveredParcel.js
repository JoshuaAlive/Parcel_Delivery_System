const ejs = require("ejs");
require("dotenv").config();
const sendMail = require("../helpers/sendmail");
const Parcel = require("../models/Parcel");

const SendParcelDeliveredEmail = async () => {
  const parcels = await Parcel.find({ status: 2 });

  if (parcels.length > 0) {
    for (let parcel of parcels) {
      ejs.renderFile(
        "templates/deliveredParcel.ejs",
        {
          sendername: parcel.sendername,
          from: parcel.from,
          to: parcel.to,
          recipientname: parcel.recipientname,
          cost: parcel.cost,
          weight: parcel.weight,
          note: parcel.note,
        },
        async (error, data) => {
          if (error) {
            console.error("Error rendering email template:", error);
            return;
          }
          let messageOption = {
            from: process.env.EMAIL,
            to: parcel.senderemail,
            subject: "Your parcel has been delivered successfully.",
            html: data,
          };
          try {
            await sendMail(messageOption);
          } catch (error) {
            console.error("Error sending email:", error);
          }
        }
      );

      ejs.renderFile(
        "templates/deliveredParcel.ejs",
        {
          sendername: parcel.sendername,
          from: parcel.from,
          to: parcel.to,
          recipientname: parcel.recipientname,
          cost: parcel.cost,
          weight: parcel.weight,
          note: parcel.note,
        },
        async (error, data) => {
          if (error) {
            console.error("Error rendering email template:", error);
            return;
          }
          let messageOption = {
            from: process.env.EMAIL,
            to: parcel.recipientemail,
            subject: "Your parcel has been delivered successfully.",
            html: data,
          };
          try {
            await sendMail(messageOption);
            await Parcel.findByIdAndUpdate(parcel._id, { $set: { status: 3 } });
          } catch (error) {
            console.error("Error sending email:", error);
          }
        }
      );
    }
  }
};
module.exports =  {SendParcelDeliveredEmail};
