const createUser = (connection, data) => {
    data.role = "user";
    data.provider = "local"
    return new Promise((resolve, reject) => {
        connection.query(
            "INSERT INTO user SET ?", data, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            }
        );
    });
};

const findUser = (connection, contact) => {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT * FROM user WHERE contact = ?", [contact],
            (err, res) => {
                if (err) return reject(err)
                resolve(res[0]);
            }
        );
    });
};

const findUserByContact = (connection, contact) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM user WHERE contact = ?", [contact],
            (err, res) => {
                if (err) return reject(err);
                resolve(res[0]);
            }
        );
    });
};

const createGoogleUser = (connection, data) => {
    data.role = "user";
    data.provider = "google";
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO user SET ?", data,
            (err, res) => {
                if (err) return reject(err);
                resolve(res);
            }
        );
    });
};

const findUserByGoogleId = (connection, googleId) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM user WHERE google_id = ?", [googleId],
            (err, res) => {
                if (err) return reject(err);
                resolve(res[0]); 
            }
        );
    });
};
const updateUser = (connection, id, data) => {
    return new Promise((resolve, reject) => {
        connection.query(
            "UPDATE user SET ? WHERE id = ?", [data, id],
            (err, res) => {
                if (err) return reject(err);
                resolve(res);
            }
        );
    });
};

const deleteUser = (connection, id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            "DELETE FROM user WHERE id = ?", [id],
            (err, res) => {
                if (err) return reject(err);
                resolve(res);
            }
        );
    });
};

const findUserById = (connection, id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT id_user, nom_user, contact, role, provider FROM user WHERE id_user = ?", [id],
            (err, res) => {
                if (err) return reject(err);
                resolve(res[0]);
            }
        );
    });
};

const findAllUsers = (connection) => {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT id_user, nom_user, contact, role, provider FROM user WHERE role = 'user'",
            (err, res) => {
                if (err) return reject(err);
                resolve(res);
            }
        );
    });
};

module.exports = {findAllUsers, findUserById, createUser, findUser, findUserByGoogleId, findUserByContact,createGoogleUser,updateUser,deleteUser };