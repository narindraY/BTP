const {registerUser, login} = require("../services/user.service");
const generateToken = require("../utils/generateToken")
const register = (req, res) =>{
    const data = {
        ...req.body,
        role:"user"
    };
    req.getConnection(async(err, connection)=>{
        if(err) return res.status(500).json(err);

        try {
            const result = await registerUser(connection, req.body);
            res.status(201).json({message:"user create with success", id: result.insertId});
            
        } catch (error) {
            res.status(500).json(error)
            
        }
    });
};


const loginUser = (req, res) => {
    const { contact, password } = req.body;
    req.getConnection(async (err, connection) => {
        try {
            const result = await login(connection, contact, password);
            res.json({
                message: "success",
                token: result.token,   // ✅ result.token, pas res.token
                user: result.user      // ✅ result.user, pas res.user
            });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    });
};
module.exports = {register, loginUser};