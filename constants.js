const { config } = require("dotenv");
config();
const port = process.env.PORT || 3000;
const invalidToken = process.env.INVALID_TOKEN || "./pages/invalid_token.html";
const tokenExpired = process.env.TOKEN_EXPIRED || "./pages/token_expired.html";
const requestRejected =
  process.env.REQUEST_REJECTED || "./pages/request_rejected.html";
const requestApproved =
  process.env.REQUEST_APPROVED || "./pages/request_approved.html";
const jWtSecret = process.env.JWT_SECRET || "jwtSecret_bana_lana";
const recipientEmail = process.env.RECIPIENT_EMAIL;
const adminEmail = process.env.ADMIN_EMAIL;
const adminEmailPassword = process.env.ADMIN_EMAIL_PASSWORD;
const expirationTime = process.env.EXPIRATION_TIME || 30 * 60 * 1000;
const shell = process.env.SHELL || "powershell";

module.exports = {
  port,
  invalidToken,
  tokenExpired,
  requestRejected,
  requestApproved,
  jWtSecret,
  recipientEmail,
  adminEmail,
  adminEmailPassword,
  expirationTime,
  shell,
};
