const bcrypt = require('bcrypt');
const {
    createUser, findUser, findUserByContact,
    findUserByGoogleId, createGoogleUser,
    updateUser, deleteUser,findUserById, findAllUsers
} = require("../models/user.models");
const generateToken = require("../utils/generateToken");

const registerUser = async (connection, data) => {
    const hash = await bcrypt.hash(data.password, 10);
    const userData = {
        nom_user: data.nom_user,
        contact: data.contact,
        password: hash
    };
    return await createUser(connection, userData);
};
const getAllUsers = async (connection) => {
    return await findAllUsers(connection);
};

const login = async (connection, contact, password) => {
    const user = await findUser(connection, contact);
    if (!user) throw new Error("user not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("password incorrect");

    const token = generateToken(user);
    return {
        token,
        user: {
            id_user: user.id_user,
            nom_user: user.nom_user,
            contact: user.contact,
            role: user.role
        }
    };
};

const googleLogin = async (connection, profile) => {
    const email = profile.emails?.[0]?.value;
    let user = await findUserByGoogleId(connection, profile.id);
    if (user) return user;

    user = await findUserByContact(connection, email);
    if (user) return user;

    const userData = {
        nom_user: profile.displayName,
        contact: email,
        google_id: profile.id
    };
    const result = await createGoogleUser(connection, userData);
    return { id_user: result.insertId, ...userData };
};

const editUser = async (connection, id, data, requesterId, requesterRole) => {
    if (requesterId !== id && requesterRole !== "admin") {
        throw new Error("Accès refusé");
    }

    const updatedData = {};

    if (data.nom_user) updatedData.nom_user = data.nom_user;
    if (data.contact)  updatedData.contact  = data.contact;
    if (data.password) {
        if (!data.old_password) {
            throw new Error("Ancien mot de passe requis");
        }
        const user = await findUser(connection, data.contact);
        const match = await bcrypt.compare(data.old_password, user.password);
        if (!match) throw new Error("Ancien mot de passe incorrect");

        updatedData.password = await bcrypt.hash(data.password, 10);
    }

    if (Object.keys(updatedData).length === 0) {
        throw new Error("Aucune donnée à mettre à jour");
    }

    return await updateUser(connection, id, updatedData);
};

const removeUser = async (connection, id, requesterId, requesterRole) => {
    if (requesterId !== id && requesterRole !== "admin") {
        throw new Error("Accès refusé");
    }

    const result = await deleteUser(connection, id);

    if (result.affectedRows === 0) {
        throw new Error("Utilisateur introuvable");
    }

    return { message: "Compte supprimé avec succès" };
};

const getProfile = async (connection, id) => {
    const user = await findUserById(connection, id);
    if (!user) throw new Error("Utilisateur introuvable");
    return user;
};


module.exports = {getAllUsers,getProfile, registerUser, login, googleLogin, editUser, removeUser };