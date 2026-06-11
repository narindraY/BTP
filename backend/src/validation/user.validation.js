const validateRegister = (req, res, next) =>{
    const {nom_user, contact, password} = req.body;

    if(!nom_user || !contact || !password){
        return res.status(400).json({
            message:"nom, contact, mot de passe obligatoire"
        });
    }
    next(); 
};
module.exports = {validateRegister};