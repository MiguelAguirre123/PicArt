const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: process.env.AWS_REGION });

async function sendEmail(toAddress, subject, body) {
    const params = {
        Destination: { ToAddresses: [toAddress] },
        Message: {
            Body: {
                Text: { Data: body },
            },
            Subject: { Data: subject },
        },
        Source: process.env.SENDER_EMAIL,
    };

    try {
        await ses.sendEmail(params).promise();
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw error;
    }
}

module.exports = {
    sendEmail,
};