const { getUserProfile } = require('../utils/dynamoUtils');

exports.handler = async (event) => {
    try {
        // Obtener el userId del parámetro de ruta
        const userId = event.pathParameters.userId;

        // Obtener el token de autorización del encabezado
        const token = event.headers.Authorization;

        // Verificar que el userId esté presente
        if (!userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'ID de usuario requerido' }),
            };
        }

        // (Opcional) Verificar el token de autorización si es necesario
        if (!token) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Token requerido' }),
            };
        }

        // Llamar a la función para obtener el perfil del usuario
        const profile = await getUserProfile(userId, token);

        if (profile) {
            return {
                statusCode: 200,
                body: JSON.stringify(profile),
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Perfil no encontrado' }),
            };
        }
    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno del servidor' }),
        };
    }
};