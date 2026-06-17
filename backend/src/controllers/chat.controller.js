const { sendMessageService, getChatHistoryService, editMessageService, deleteMessageService } = require("../services/chat.service");

const postMessage = (req, res) => {
    const { id: utilisateur_id, role } = req.user;
    const { contenu, discussion_id } = req.body;
    req.getConnection(async (err, connection) => {
        if (err) return res.status(500).json({ error: "Erreur de connexion DB" });
        try {
            const result = await sendMessageService(connection, { utilisateur_id, contenu, role, discussion_id });
            res.status(201).json({ success: true, message_id: result.insertId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

const getHistory = (req, res) => {
    const { id: utilisateur_id, role } = req.user;
    const { discussion_id } = req.query;
    req.getConnection(async (err, connection) => {
        if (err) return res.status(500).json({ error: "Erreur de connexion DB" });
        try {
            const history = await getChatHistoryService(connection, utilisateur_id, role, discussion_id);
            res.json(history);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

const getDiscussions = (req, res) => {
    const { id: utilisateur_id, role } = req.user;
    req.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: "Erreur de connexion DB" });
        const baseSelect = `SELECT d.*, u.nom,
          (SELECT m.contenu FROM message m WHERE m.discussion_id = d.id_discussion AND m.is_deleted = 0 ORDER BY m.date_creation DESC LIMIT 1) as last_message,
          (SELECT m.utilisateur_id FROM message m WHERE m.discussion_id = d.id_discussion AND m.is_deleted = 0 ORDER BY m.date_creation DESC LIMIT 1) as last_sender,
          (SELECT m.lu FROM message m WHERE m.discussion_id = d.id_discussion AND m.is_deleted = 0 ORDER BY m.date_creation DESC LIMIT 1) as last_lu,
          (SELECT COUNT(*) FROM message m WHERE m.discussion_id = d.id_discussion AND m.utilisateur_id != ? AND m.lu = 0) as non_lu
          FROM discussion d JOIN utilisateur u ON d.client_id = u.id_utilisateur`;
        const sql = role === 'admin'
            ? baseSelect
            : baseSelect + " WHERE d.client_id = ? OR d.id_discussion IN (SELECT discussion_id FROM message WHERE utilisateur_id = ?)";
        const params = role === 'admin'
            ? [utilisateur_id]
            : [utilisateur_id, utilisateur_id, utilisateur_id];
        connection.query(sql, params, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    });
};

const startDiscussion = (req, res) => {
    const { client_id } = req.body;
    if (!client_id) return res.status(400).json({ error: "Client ID requis" });
    req.getConnection(async (err, connection) => {
        if (err) return res.status(500).json({ error: "Erreur de connexion DB" });
        connection.query("SELECT * FROM discussion WHERE client_id = ?", [client_id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length > 0) {
                res.json({ id_discussion: results[0].id_discussion });
            } else {
                connection.query("INSERT INTO discussion (client_id, statut) VALUES (?, 'ouverte')", [client_id], (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.status(201).json({ id_discussion: result.insertId });
                });
            }
        });
    });
};

// Lister les clients (pour créer une discussion)
const getClients = (req, res) => {
    req.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: "Erreur de connexion DB" });
        connection.query("SELECT id_utilisateur, nom, email FROM utilisateur WHERE role = 'client' ORDER BY nom", (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    });
};

const uploadFile = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier' });
  res.json({ url: `/uploads/${req.file.filename}`, name: req.file.originalname, type: req.file.mimetype });
};

const editMessage = (req, res) => {
    const { id } = req.params;
    const { contenu } = req.body;
    const userId = req.user.id;
    if (!contenu?.trim()) return res.status(400).json({ error: "Contenu requis" });
    req.getConnection(async (err, connection) => {
        if (err) return res.status(500).json({ error: "Erreur de connexion DB" });
        try {
            const updated = await editMessageService(connection, id, userId, contenu);
            res.json(updated);
        } catch (error) {
            res.status(error.message === 'Action non autorisée' ? 403 : 404).json({ error: error.message });
        }
    });
};

const deleteMessage = (req, res) => {
    const { id } = req.params;
    const { mode } = req.query;
    const userId = req.user.id;
    req.getConnection(async (err, connection) => {
        if (err) return res.status(500).json({ error: "Erreur de connexion DB" });
        try {
            const result = await deleteMessageService(connection, id, userId, mode || 'self');
            res.json(result);
        } catch (error) {
            res.status(error.message === 'Action non autorisée' ? 403 : 404).json({ error: error.message });
        }
    });
};

module.exports = { postMessage, getHistory, getDiscussions, startDiscussion, uploadFile, editMessage, deleteMessage, getClients };
