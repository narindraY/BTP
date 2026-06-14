const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        {
            id : user.id_utilisateur || user.id_user,
            nom: user.nom,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"30d"
        }
    );
};
module.exports = generateToken;