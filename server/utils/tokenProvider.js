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
  if (!token || typeof token !== 'string') {
    throw new jsonwebtoken.JsonWebTokenError('jsonwebtoken must be a string');
  }

  try {
    return jsonwebtoken.verify(token, process.env.secretKey);
  } catch (err) {
    throw err;
  }
};

module.exports = { generateToken, verifyToken ,generateTokenForPassword};