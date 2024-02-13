const { expirationTime } = require("../constants");
const { rejectionScript } = require("../scripts/rejection");
// Create a map to store email addresses and tokens
const emailTokenMap = new Map();

// Function to add email to token
const addEmailToToken = (email, token) => {
  const expirationTimer = setTimeout(() => {
    emailTokenMap.delete(email);
    rejectionScript();
  }, expirationTime);
  emailTokenMap.set(email, { token, expirationTimer });
};

// Function to remove email from token
const removeEmail = (email) => {
  const tokenInfo = emailTokenMap.get(email);
  if (tokenInfo) {
    clearTimeout(tokenInfo.expirationTimer);
    emailTokenMap.delete(email);
  }
};

const emailPresent = (email) => {
  return !!emailTokenMap.get(email);
};

module.exports = { addEmailToToken, removeEmail, emailPresent };
