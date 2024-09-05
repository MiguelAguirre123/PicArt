const { confirmUserEmail } = require('../utils/dynamoUtils');

exports.handler = async (event) => {
    try {
        const token = event.queryStringParameters.token;

        if (!token) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Token no proporcionado' }),
            };
        }

        const result = await confirmUserEmail(token);

        if (result) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Correo confirmado exitosamente' }),
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Token inválido o expirado' }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno del servidor' }),
        };
    }
};