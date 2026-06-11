const createUser = (connection, data) => {
    data.role = "user";
    return new Promise((resolve, reject)=>{
        connection.query(
            "INSERT INTO user SET ?", data,(err, res)=>{
                if(err) return reject(err);
                resolve(res);
            }
        );
    });
};

const findUser = (connection, contact) =>{
    return new Promise((resolve, reject)=>{
        connection.query(
            "SELECT * FROM user WHERE contact = ?", [contact],
            (err, res) =>{
                if(err) return reject(err)
                resolve(res[0]);
            }
        );
    });
};

const findUserByGoogleId = (connection, googleId) =>{
    return new Promise((resolve, reject)=>{
        connection.query("SELECT * FROM user WHERE google_id = ?", [googleId],
            (err, res)=>{
                if (err) {
                    return reject(err)
                }
                resolve(res[0]);
            }
        );
    });
};

const findUserByContact = (connection, contact) =>{
    return new Promise((resolve, reject) =>{
        connection.query("SELECT * FROM user WHERE contact = ?",
            [contact],
            (err, res) =>{
                if (err) {
                    return reject(err);
                    resolve(res[0]);
                }
            }
        );
    });
};

module.exports = {createUser, findUser, findUserByGoogleId, findUserByContact};