const { deleteUserProfile } = require('../utils/cognitoUtils');

exports.handler = async (event) => {
    try {
        // Obtener el userId del parámetro de ruta
        const userId = event.pathParameters.userId;

        // Verificar que el userId esté presente
        if (!userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'userId requerido' }),
            };
        }

        // (Opcional) Verificar el token de autorización
        const token = event.headers.Authorization;
        if (!token) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Token requerido' }),
            };
        }

        // Llamar a la función para eliminar el perfil del usuario
        const result = await deleteUserProfile(userId);

        if (result) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Perfil eliminado exitosamente' }),
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Perfil no encontrado' }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno del servidor' }),
        };
    }
};