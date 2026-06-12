const validateRegister = (req, res, next) => {
    const { nom_user, contact, password } = req.body;

    if (!nom_user || !contact || !password) {
        return res.status(400).json({
            message: "nom_user, contact et password obligatoires"
        });
    }

    next();
};
const validateGoogleUser = (req, res, next) => {
    const user = req.user;

    if (!user || !user.id) {
        return res.status(400).json({
            message: "Invalid Google user"
        });
    }

    next();
};
module.exports = {
    validateRegister,
    validateGoogleUser
};