const bcrypt = require('bcrypt');
const {createUser, findUser, findUserByContact, findUserByGoogleId} = require("../models/user.models");
const generateToken = require("../utils/generateToken")
const registerUser = async(connection, data)=>{
    const hash = await bcrypt.hash(data.password, 10);

    const userData = {
        nom_user: data.nom_user,
        contact: data.contact,
        role: data.role,
        password: hash
    };
    return await createUser(connection, userData);
};


const login = async (connection, contact, password) =>{
    const user = await findUser(connection, contact);
    if (!user) {
        throw new Error("user not found");
        
    }
    const match = await bcrypt.compare(
        password, user.password
    );
    if (!match) {
        throw new Error("password incorrect");     
    }
    const token = generateToken(user);
    return{token, user : {
            id_user: user.id_user,
            nom_user: user.nom_user,
            contact: user.contact,
            role: user.role
        }};
};
const googleLogin = async (connection, profile) =>{
    let user = await findUserByGoogleId(
        connection, profile.id
    );
    if (user) {
        return user;
    }
    const email = profile.emails?.[0]?.value;
    user = await findUserByContact(connection, email);
    if (user) {
        return user;
    }
    const userData = {
        nom_user: profile.displayName,
        contact: email,
        role: "user",
        provider: "google",
        google_id: profile.id,
        password: null
    };
    const result = await createUser(connection, userData);
    return{
        id_user: result.insertId, ...userData
    };
};


module.exports = {registerUser, login, googleLogin};