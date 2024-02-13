const { exec } = require("child_process");
const { shell } = require("../constants");

const acceptedScriptPath = "./approved.ps1";

const acceptedScript = () => {
  exec(`${shell} ${acceptedScriptPath}`, (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (error) console.log(`exec error: ${error}`);
  });
};

module.exports = { acceptedScript };
