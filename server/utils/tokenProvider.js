const jsonwebtoken = require('jsonwebtoken');

const generateToken = (payload) => {
    return jsonwebtoken.sign(payload, process.env.secretKey, { expiresIn: '1hr' });
}


const generateTokenForPassword = (userId) => {
  const secretKey = process.env.secretKey;
  const token = jsonwebtoken.sign(
    { userId }, // payload
    secretKey,
    { expiresIn: '24h' } // token valid for 24 hours
  );
  return token;
};



const verifyToken = (token) => {
    return jsonwebtoken.verify(token, process.env.secretKey);
}

module.exports = { generateToken, verifyToken ,generateTokenForPassword};