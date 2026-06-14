const bcrypt = require('bcrypt');
const {createUser,findUser,findUserByContact,findUserByGoogleId,findUserByEmail,createGoogleUser} = require("../models/user.models");

const generateToken = require("../utils/generateToken");
const registerUser = async (connection, data) => {
    const hash = await bcrypt.hash(data.password, 10);

    const userData = {
        nom: data.nom,
        email: data.email,
        contact: data.contact,
        mot_de_passe: hash,
        role: "user",
        actif: true
    };

    return await createUser(connection, userData);
};

const login = async (connection, contact, password) => {
    const user = await findUser(connection, contact);
    if (!user) {
        throw new Error("user not found");
    }
    const match = await bcrypt.compare(password, user.mot_de_passe);

    if (!match) {
        throw new Error("password incorrect");
    }
    const token = generateToken(user);
    return {
        token,
        user: {
            id_utilisateur: user.id_utilisateur,
            nom: user.nom,
            contact: user.contact,
            role: user.role
        }
    };
};

const googleLogin = async (connection, profile) => {
    const email = profile.emails?.[0]?.value;

    // Searching by email since google_id is missing in the new schema
    let user = await findUserByEmail(connection, email);

    if (user) {
        return user;
    }

    const userData = {
        nom: profile.displayName,
        email: email,
        mot_de_passe: 'google-auth', // placeholder since it's required in schema
        role: "user",
        actif: true
    };

    await createGoogleUser(connection, userData);
    return await findUserByEmail(connection, email);
};

module.exports = {registerUser,login,googleLogin};
