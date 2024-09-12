const { registerUser } = require('../utils/cognitoUtils'); // Asegúrate de tener el archivo cognitoUtils.js con las funciones necesarias

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
        const { statusCode, body } = await registerUser(email, password, name, type);
        if (statusCode === 400) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'El correo ya está registrado' }),
            };
        }
        else if(statusCode === 201) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Registro exitoso. Verifica tu correo electrónico.' }),
            };
        }
        else{
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Error interno del servidor' }),
            };           
        }
    } catch (error) {
        console.error('Error en el manejador:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno del servidor' }),
        };
    }
};