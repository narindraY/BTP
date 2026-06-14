const validateRegister = (req, res, next) => {
    const { nom, email, contact, password } = req.body;

    if (!nom || !email || !password) {
        return res.status(400).json({
            message: "nom, email et mot de passe sont obligatoires"
        });
    }

    next();
};
const validateGoogleUser = (req, res, next) => {
    const user = req.user;

    if (!user || !user.id) {
        return res.status(400).json({
            message: "L'utilisateur google est invalide"
        });
    }

    next();
};
module.exports = {
    validateRegister,
    validateGoogleUser
};