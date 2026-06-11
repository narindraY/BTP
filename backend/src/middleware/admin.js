const admin = (req, res, next) =>{
    if(req.user.role !== "admin"){
        return res.status(403).json({message:"admin only"});
    }
    next();
}
module.exports = admin; 