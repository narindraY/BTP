const createUser = (connection, data) => {
    return new Promise((resolve, reject) => {
        connection.query(
            "INSERT INTO utilisateur SET ?", data, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            }
        );
    });
};

const findUser = (connection, contact) => {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT * FROM utilisateur WHERE contact = ?", [contact],
            (err, res) => {
                if (err) return reject(err)
                resolve(res[0]);
            }
        );
    });
};

const findUserByContact = (connection, contact) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM utilisateur WHERE contact = ?", [contact],
            (err, res) => {
                if (err) return reject(err);
                resolve(res[0]);
            }
        );
    });
};

const findUserByEmail = (connection, email) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM utilisateur WHERE email = ?", [email],
            (err, res) => {
                if (err) return reject(err);
                resolve(res[0]);
            }
        );
    });
};

const createGoogleUser = (connection, data) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO utilisateur SET ?", data,
            (err, res) => {
                if (err) return reject(err);
                resolve(res);
            }
        );
    });
};

const findUserByGoogleId = (connection, googleId) => {
    return new Promise((resolve, reject) => {
        // Note: The new schema doesn't have google_id, we might need to add it or use email
        connection.query("SELECT * FROM utilisateur WHERE email = ?", [googleId],
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

module.exports = { findUserById, createUser, findUser, findUserByGoogleId, findUserByContact, createGoogleUser, updateUser, deleteUser };
