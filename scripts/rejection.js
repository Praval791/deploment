const { exec } = require("child_process");
const { shell } = require("../constants");

const rejectedScriptPath = "./reject.ps1";

const rejectionScript = () => {
  exec(`${shell} ${rejectedScriptPath}`, (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (error) console.log(`exec error: ${error}`);
  });
};

module.exports = { rejectionScript };
