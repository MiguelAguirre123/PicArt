const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const SECRET_KEY = crypto.randomBytes(32).toString('hex');

function generateToken(email) {
    return jwt.sign({ email }, SECRET_KEY, { expiresIn: '30s' });
}

module.exports = {
    generateToken,
};