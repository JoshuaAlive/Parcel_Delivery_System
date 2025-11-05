const ejs = require("ejs");
require("dotenv").config();
const sendMail = require("../helpers/sendmail");
const Parcel = require("../models/Parcel");

const SendParcelPendingEmail = async () => {
  const parcels = await Parcel.find({ status: 0 });

  if (parcels.length > 0) {
    for (let parcel of parcels) {
      ejs.renderFile(
        "templates/pendingParcel.ejs",
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
            subject: "You've got a parcel, and it is yet to be delivered.",
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
        "templates/pendingParcel.ejs",
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
            subject: "You've got a parcel, and it is yet to be delivered.",
            html: data,
          };
          try {
            await sendMail(messageOption);
            await Parcel.findByIdAndUpdate(parcel._id, { $set: { status: 1 } });
          } catch (error) {
            console.error("Error sending email:", error);
          }
        }
      );
    }
  }
};
module.exports =  {SendParcelPendingEmail};
