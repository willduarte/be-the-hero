const crypto = require("crypto");

module.exports = function generateUniqueId() {
  const id = crypto.randomBytes(4).toString("HEX");
  return id;
};
