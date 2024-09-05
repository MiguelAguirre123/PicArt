module.exports = {
    AWS_REGION: process.env.AWS_REGION || 'us-east-2',
    USERS_TABLE: process.env.USERS_TABLE,
    TOKENS_TABLE: process.env.TOKENS_TABLE,
    SECRET_KEY: process.env.SECRET_KEY,
    FRONTEND_URL: process.env.FRONTEND_URL,
    SENDER_EMAIL: process.env.SENDER_EMAIL,
};