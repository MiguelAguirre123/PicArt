const { authenticateUser } = require('../utils/dynamoUtils');
const { generateToken } = require('../utils/tokenUtils');

exports.handler = async (event) => {
    try {
        const { email, password } = JSON.parse(event.body);

        if (!email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Email y contraseña son requeridos' }),
            };
        }

        const user = await authenticateUser(email, password);

        if (user) {
            const token = generateToken(email);
            return {
                statusCode: 200,
                body: JSON.stringify({ token }),
            };
        } else {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Credenciales inválidas' }),
            };
        }
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno del servidor' }),
        };
    }
};
