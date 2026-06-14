const createDiscussion = (connection, data) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO discussion SET ?", data, (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
};

const findDiscussionByClientId = (connection, clientId) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM discussion WHERE client_id = ?", [clientId], (err, res) => {
            if (err) return reject(err);
            resolve(res[0]);
        });
    });
};

const createMessage = (connection, data) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO message SET ?", data, (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
};

const getMessagesByDiscussion = (connection, discussionId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT m.*, u.nom
            FROM message m
            JOIN utilisateur u ON m.utilisateur_id = u.id_utilisateur
            WHERE m.discussion_id = ?
            ORDER BY m.date_creation ASC
        `;
        connection.query(sql, [discussionId], (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
};

const updateMessage = (connection, messageId, contenu) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE message SET contenu = ?, is_edited = 1 WHERE id_message = ?", [contenu, messageId], (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
};

const deleteMessageForAll = (connection, messageId) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE message SET is_deleted = 1 WHERE id_message = ?", [messageId], (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
};

const deleteMessageForUser = (connection, messageId, userId) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT deleted_for FROM message WHERE id_message = ?", [messageId], (err, rows) => {
            if (err) return reject(err);
            const current = rows[0]?.deleted_for ? JSON.parse(rows[0].deleted_for) : [];
            if (current.includes(userId)) return resolve({ id_message: messageId, already_deleted: true });
            current.push(userId);
            connection.query("UPDATE message SET deleted_for = ? WHERE id_message = ?", [JSON.stringify(current), messageId], (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    });
};

const getMessageById = (connection, messageId) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM message WHERE id_message = ?", [messageId], (err, res) => {
            if (err) return reject(err);
            resolve(res[0]);
        });
    });
};

module.exports = {
    createDiscussion,
    findDiscussionByClientId,
    createMessage,
    getMessagesByDiscussion,
    updateMessage,
    deleteMessageForAll,
    deleteMessageForUser,
    getMessageById
};