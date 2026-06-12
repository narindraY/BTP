const {
    registerUser,
    login,
    googleLogin
} = require("../services/user.service");

const generateToken = require("../utils/generateToken");
const register = (req, res) => {
    req.getConnection(async (err, connection) => {
        if (err) return res.status(500).json(err);
        try {
            const result = await registerUser(connection, req.body);
            res.status(201).json({
                message: "user created successfully",
                id: result.insertId
            });
        } catch (error) {
            res.status(500).json(error);
        }
    });
};

const loginUser = (req, res) => {
    const { contact, password } = req.body;
    req.getConnection(async (err, connection) => {
        if (err) return res.status(500).json(err);
        try {
            const result = await login(connection, contact, password);
            res.json({
                message: "success",
                token: result.token,
                user: result.user
            });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    });
};

const googleAuth = async (req, res) => {
  req.getConnection(async (err, connection) => {
    if (err) {
        return res.redirect("http://localhost:5173/login?error=google");
    }
    try {
        const user = await googleLogin(connection, req.user);
        console.log("User:", user);
        const token = generateToken(user);
        return res.redirect(`http://localhost:5173/user`);
    } catch (error) {
        return res.redirect("http://localhost:5173/login?error=google");
    }
});
};

module.exports = {register,loginUser,googleAuth};