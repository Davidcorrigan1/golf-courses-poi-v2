const jwt = require('jsonwebtoken');
const User = require("../models/user");
const env = require('dotenv');
env.config();

exports.createToken = function (user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.jwt_key, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });
};

exports.decodeToken = function (token) {
  let userInfo = {}

  try {
    let decoded = jwt.verify(token, process.env.jwt_key);
    userInfo.userId = decoded.id;
    userInfo.email = decoded.email;
    return userInfo;
  } catch (e) {
    return false;
  }
};

exports.validate = async function (decoded, request) {
  const user = await User.findById({_id: decoded.id});
  if (!user) {
    return { isValid: false };
  } else {
    return { isValid: true };
  }
};