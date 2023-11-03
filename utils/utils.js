/*const jwt = require("jsonwebtoken");
const generateToken = (user) =>
  jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "5m" });
module.exports = generateToken;*/
function generateRandomToken() {
  return Math.random().toString(36).substr(2, 10); // Generate a random token
}

module.exports = {
  generateRandomToken,
};

