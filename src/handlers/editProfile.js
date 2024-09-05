const { updateUserProfile } = require('../utils/dynamoUtils');

exports.handler = async (event) => {
    try {
        const token = event.headers.Authorization;
        const { name, bio, photo } = JSON.parse(event.body);

        if (!token || !name) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Token y nombre son requeridos' }),
            };
        }

        // Verificar y actualizar perfil
        const updatedProfile = await updateUserProfile(token, { name, bio, photo });

        if (updatedProfile) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Perfil actualizado exitosamente' }),
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