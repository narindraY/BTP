const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        {
            id : user.id_user,
            role: user.role
        },
        process.env.jwt_secret,
        {
            expiresIn:"30d"
        }
    );
};
module.exports = generateToken;