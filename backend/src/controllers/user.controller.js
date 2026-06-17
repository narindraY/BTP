const {
    registerUser,
    login,
    googleLogin,
    editUser,
    removeUser,getProfile,getAllUsers
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
const getUsers = (req, res) => {
    req.getConnection(async (err, connection) => {
        if (err) return res.status(500).json({ message: "Erreur de connexion" });

        try {
            const users = await getAllUsers(connection);
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
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
        if (err) return res.redirect("http://localhost:5173/login?error=google");
        try {
            const user = await googleLogin(connection, req.user);
            const token = generateToken(user);
            return res.redirect(`http://localhost:5173/user?token=${token}`);
        } catch (error) {
            return res.redirect("http://localhost:5173/login?error=google");
        }
    });
};

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    req.getConnection(async (err, connection) => {
        if (err) return res.status(500).json({ message: "Erreur de connexion" });
        try {
            await editUser(
                connection,
                id,
                req.body,
                req.user.id_user,
                req.user.role
            );
            res.json({ message: "Compte mis à jour avec succès" });
        } catch (error) {
            const status =
                error.message === "Accès refusé" ? 403 :
                error.message === "Ancien mot de passe incorrect" ? 401 :
                error.message === "Aucune donnée à mettre à jour" ? 400 : 500;
            res.status(status).json({ message: error.message });
        }
    });
};

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
    req.getConnection(async (err, connection) => {
        if (err) return res.status(500).json({ message: "Erreur de connexion" });
        try {
            const result = await removeUser(
                connection,
                id,
                req.user.id_user,
                req.user.role
            );
            res.json(result);
        } catch (error) {
            const status =
                error.message === "Accès refusé" ? 403 :
                error.message === "Utilisateur introuvable" ? 404 : 500;
            res.status(status).json({ message: error.message });
        }
    });
};
const getMe = (req, res) => {
    req.getConnection(async (err, connection) => {
        if (err) return res.status(500).json({ message: "Erreur de connexion" });
        try {
            const user = await getProfile(connection, req.user.id);
            res.json({ user });
            console.log(req.user);
        } catch (error) {
            const status = error.message === "Utilisateur introuvable" ? 404 : 500;
            res.status(status).json({ message: error.message });
        }
    });
};

module.exports = {getUsers,getMe, register, loginUser, googleAuth, updateUser, deleteUser };