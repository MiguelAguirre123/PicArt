const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider(); // Inicializa Cognito Identity Service Provider

const USER_POOL_ID = 'us-east-2_73AF8zM4x'; // Reemplaza con tu User Pool ID
const CLIENT_ID = '17gq4da5m38t8tl1e2pee95ub4'; // Reemplaza con tu Client ID

async function registerUser(email, password, name, type) {
    try {
        // Verifica si el correo ya está registrado
        const params = {
            UserPoolId: USER_POOL_ID,
            Filter: `email = "${email}"`
        };

        const result = await cognito.listUsers(params).promise();
        
        if (result.Users.length > 0) {
            // El usuario ya existe
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'El correo electrónico ya está registrado.' })
            };
        }

        // Registra un nuevo usuario en Cognito
        const paramsRegister = {
            ClientId: CLIENT_ID,
            Password: password,
            Username: email,
            UserAttributes: [
                { Name: 'email', Value: email },
                { Name: 'given_name', Value: name },
                { Name: 'custom:TipoUsuario', Value: type }
            ]
        };

        await cognito.signUp(paramsRegister).promise();
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Registro exitoso. Verifica tu correo electrónico.' })
        };
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error al registrar usuario.' })
        };
    }
}

async function confirmUserEmail(email, code) {
    try {
        // Parámetros para confirmar el registro del usuario
        const paramsConfirm = {
            ClientId: CLIENT_ID,
            ConfirmationCode: code,
            Username: email
        };

        // Confirmar el registro del usuario con el código de verificación
        await cognito.confirmSignUp(paramsConfirm).promise();

        return true; // Confirmación exitosa
    } catch (error) {
        console.error('Error al confirmar el correo electrónico:', error);
        return false; // Error en la confirmación
    }
}

async function authenticateUser(email, password) {
    try {
        const paramsAuth = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: CLIENT_ID,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            }
        };

        const result = await cognito.initiateAuth(paramsAuth).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(result)
        };
    } catch (error) {
        console.error('Error en la autenticación:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error en la autenticación.' })
        };
    }
}

async function updateUserProfile(email, updates) {
    try {
        const paramsUpdate = {
            UserPoolId: USER_POOL_ID,
            Username: email,
            UserAttributes: [
                { Name: 'name', Value: updates.name },
                { Name: 'bio', Value: updates.bio },
                { Name: 'picture', Value: updates.photo }
            ]
        };

        await cognito.adminUpdateUserAttributes(paramsUpdate).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Perfil actualizado con éxito.' })
        };
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error al actualizar perfil.' })
        };
    }
}

async function getUserProfile(userId) {
    try {
        const params = {
            UserPoolId: USER_POOL_ID,
            Username: userId
        };

        const result = await cognito.adminGetUser(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(result)
        };
    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error obteniendo perfil.' })
        };
    }
}

async function deleteUserProfile(userId) {
    try {
        const params = {
            UserPoolId: USER_POOL_ID,
            Username: userId
        };

        await cognito.adminDeleteUser(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Perfil eliminado con éxito.' })
        };
    } catch (error) {
        console.error('Error eliminando perfil:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error eliminando perfil.' })
        };
    }
}

module.exports = {
    registerUser,
    confirmUserEmail,
    authenticateUser,
    updateUserProfile,
    getUserProfile,
    deleteUserProfile
};