const { confirmUserEmail } = require('../utils/cognitoUtils');

exports.handler = async (event) => {
    try {
        // Extrae los datos del cuerpo de la solicitud
        const { email, code } = JSON.parse(event.body);

        if (!email || !code) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Correo electrónico o código no proporcionados' }),
            };
        }

        // Llama a la función para confirmar el correo electrónico
        const result = await confirmUserEmail(email, code);

        if (result) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Correo confirmado exitosamente' }),
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Código inválido o expirado' }),
            };
        }
    } catch (error) {
        console.error('Error al confirmar correo:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno del servidor' }),
        };
    }
};