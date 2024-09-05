const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { sendEmail } = require('./emailUtils');
const { generateToken } = require('./tokenUtils');
const uuid = require('uuid'); // Para generar un ID único para cada usuario
const bcrypt = require('bcryptjs'); // Importar bcrypt para manejo de contraseñas


const USERS_TABLE = process.env.USERS_TABLE || 'Usuario'; // Tabla de usuarios

async function registerUser(email, password, name, type) {
    // Verifica si el correo ya está registrado
    const params = {
        TableName: 'Usuarios',
        IndexName: 'EmailIndex', // Asumiendo que creas un índice global secundario en Email
        KeyConditionExpression: 'Email = :email',
        ExpressionAttributeValues: {
            ':email': email
        }
    };

    try {
        const result = await dynamoDB.query(params).promise();
        
        if (result.Items.length > 0) {
            // El usuario ya existe
            return true;
        }

        // Encripta la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 8);

        // Si no existe, agrega al nuevo usuario
        const newUser = {
            TableName: 'Usuarios',
            Item: {
                ID_Usuario: uuid.v4(), // Genera un ID único
                Nombre: name,
                Email: email,
                Tipo_Usuario: type, // Por ejemplo, 'Comprador', 'Donador' o 'Artista'
                Contrasena: hashedPassword, // Guardada contraseña encriptada
                Fecha_Registro: new Date().toISOString() // Fecha y hora actual en formato ISO
            }
        };
        
        await dynamoDB.put(newUser).promise();
        return false; // Usuario registrado con éxito
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        throw new Error('Error al registrar usuario');
    }
}

async function confirmUserEmail(email) {
    const params = {
        TableName: USERS_TABLE,
        Key: { ID_Usuario: email },
        UpdateExpression: 'set Confirmado = :true',
        ExpressionAttributeValues: {
            ':true': true,
        },
    };
    try {
        await dynamoDB.update(params).promise();
        return true; // Confirmación exitosa
    } catch (error) {
        return false; // Error en la confirmación
    }
}

async function authenticateUser(email, password) {
    const params = {
        TableName: 'Usuarios',
        IndexName: 'EmailIndex', // Usamos el índice global secundario
        KeyConditionExpression: 'Email = :email',
        ExpressionAttributeValues: {
            ':email': email
        }
    };
    
    try {
        const result = await dynamoDB.query(params).promise();
        
        // Verifica si se encontró un usuario con ese email
        if (result.Items.length > 0) {
            const user = result.Items[0];
            // Compara la contraseña ingresada con la contraseña encriptada almacenada
            const isPasswordValid = await bcrypt.compare(password, user.Contrasena);
            if (isPasswordValid) {
                return user; // Autenticación exitosa
            }
        }
        
        return null; // Credenciales inválidas
    } catch (error) {
        console.error('Error en la autenticación:', error);
        return null; // Error en la autenticación
    }
}

async function updateUserProfile(email, updates) {
    const params = {
        TableName: USERS_TABLE,
        Key: { ID_Usuario: email },
        UpdateExpression: 'set Nombre = :name, Bio = :bio, Foto = :photo',
        ExpressionAttributeValues: {
            ':name': updates.name,
            ':bio': updates.bio,
            ':photo': updates.photo,
        },
    };
    try {
        await dynamoDB.update(params).promise();
        return true; // Actualización exitosa
    } catch (error) {
        return false; // Error en la actualización
    }
}

const getUserProfile = async (userId) => {
    const params = {
        TableName: USERS_TABLE,
        Key: { ID_Usuario: userId },
    };

    try {
        const result = await dynamoDB.get(params).promise();
        return result.Item; // Retorna el perfil del usuario
    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        throw new Error('Error obteniendo perfil');
    }
};

const deleteUserProfile = async (userId) => {
    const params = {
        TableName: USERS_TABLE,
        Key: { ID_Usuario: userId },
    };

    try {
        await dynamoDB.delete(params).promise();
        return true; // Eliminación exitosa
    } catch (error) {
        console.error('Error eliminando perfil:', error);
        throw new Error('Error eliminando perfil');
    }
};

async function sendConfirmationEmail(email, token) {
    const subject = 'Confirmación de tu cuenta';
    const body = `Por favor, confirma tu cuenta usando este enlace: ${process.env.FRONTEND_URL}/confirm-email?token=${token}`;

    const params = {
        Destination: { ToAddresses: [email] },
        Message: {
            Body: { Text: { Data: body } },
            Subject: { Data: subject },
        },
        Source: process.env.SENDER_EMAIL,
    };

    try {
        await sendEmail(email, subject, body);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
}

module.exports = {
    registerUser,
    confirmUserEmail,
    authenticateUser,
    updateUserProfile,
    getUserProfile,
    deleteUserProfile,
    sendConfirmationEmail,
};