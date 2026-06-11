const validatePublication = (req, res, next) => {
    const {titre, contenu} = req.body;
    if(!req.body){
        return res.status(400).json({message:"champs manquant"});
    }
    next();
};
module.exports = {validatePublication};