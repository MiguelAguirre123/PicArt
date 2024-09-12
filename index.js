const registerUser = require('./src/handlers/registerUser');
const confirmEmail = require('./src/handlers/confirmEmail');
const loginUser = require('./src/handlers/loginUser');
const editProfile = require('./src/handlers/editProfile');
const getProfile = require('./src/handlers/getProfile');
const deleteProfile = require('./src/handlers/deleteProfile');

exports.handler = async (event) => {
    const { httpMethod, resource, pathParameters, queryStringParameters, headers, body } = event;

    try {
        if (httpMethod === 'POST' && resource === '/register') {
            return registerUser.handler(event);
        } else if (httpMethod === 'POST' && resource === '/confirm-email') {
            return confirmEmail.handler(event);
        } else if (httpMethod === 'POST' && resource === '/login') {
            return loginUser.handler(event);
        } else if (httpMethod === 'PUT' && resource === '/profile') {
            return editProfile.handler(event);
        } else if (httpMethod === 'GET' && resource === '/profile/{userId}') {
            const userId = pathParameters && pathParameters.userId;
            return getProfile.handler({ ...event, pathParameters: { userId } });
        } else if (httpMethod === 'DELETE' && resource === '/profile/{userId}') {
            const userId = pathParameters && pathParameters.userId;
            return deleteProfile.handler({ ...event, pathParameters: { userId } });
        }

        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Recurso no encontrado' }),
        };
    } catch (error) {
        console.error('Error en el manejador:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno del servidor' }),
        };
    }
};