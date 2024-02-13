const jwt = require("jsonwebtoken");
const { jWtSecret, expirationTime } = require("../constants");

const createToken = (email) => {
  return jwt.sign({ email }, jWtSecret, { expiresIn: expirationTime });
};

const getPayload = (token) => {
  try {
    const payload = jwt.verify(token, jWtSecret);
    return { payload, error: null };
  } catch (error) {
    return { payload: null, error: error.message };
  }
};

module.exports = { createToken, getPayload };
