const cron = require("node-cron");

const run = () => {
    cron.schedule("* * * * * *", () => {
        
});
}


module.exports = { run };