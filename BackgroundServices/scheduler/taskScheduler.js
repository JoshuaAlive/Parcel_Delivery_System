const cron = require("node-cron");
const { sendWelcomeEmail } = require("../EmailService/welcomeEmail");

const run = () => {
    cron.schedule("* * * * * *", () => {
        sendWelcomeEmail();
        
});
}


module.exports = { run };