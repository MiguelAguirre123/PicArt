const { registerUser } = require('../utils/dynamoUtils');

exports.handler = async (event) => {
    try {
        // Extrae los datos del cuerpo de la solicitud
        const { name, email, password, type } = JSON.parse(event.body);

        // Validar datos
        if (!email || !password || !name || !type) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Datos incompletos' }),
            };
        }

        // Verificar si el correo ya está registrado
        const userExists = await registerUser(email, password, name, type);
        if (userExists) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'El correo ya está registrado' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Registro exitoso' }),
        };
    } catch (error) {
        console.error('Error en el manejador:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno del servidor' }),
        };
    }
};