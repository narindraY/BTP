const {
    createDiscussion,
    findDiscussionByClientId,
    createMessage,
    getMessagesByDiscussion,
    updateMessage,
    deleteMessageForAll,
    deleteMessageForUser,
    getMessageById
} = require("../models/chat.models");

const sendMessageService = async (connection, { utilisateur_id, contenu, role, discussion_id }) => {
    let targetDiscussionId = discussion_id;

    if (role !== 'admin' && !targetDiscussionId) {
        let discussion = await findDiscussionByClientId(connection, utilisateur_id);
        if (!discussion) {
            const result = await createDiscussion(connection, {
                client_id: utilisateur_id,
                statut: 'ouverte'
            });
            targetDiscussionId = result.insertId;
        } else {
            targetDiscussionId = discussion.id_discussion;
        }
    }

    return await createMessage(connection, {
        discussion_id: targetDiscussionId,
        utilisateur_id: utilisateur_id,
        contenu: contenu,
        lu: false
    });
};

const getChatHistoryService = async (connection, utilisateur_id, role, discussion_id) => {
    let targetId = discussion_id;

    if (role !== 'admin' && !targetId) {
        const discussion = await findDiscussionByClientId(connection, utilisateur_id);
        if (!discussion) return [];
        targetId = discussion.id_discussion;
    }

    if (!targetId) return [];

    const messages = await getMessagesByDiscussion(connection, targetId);
    return messages.filter(m => {
        if (!m.deleted_for) return true;
        try {
            return !JSON.parse(m.deleted_for).includes(utilisateur_id);
        } catch { return true; }
    });
};

const editMessageService = async (connection, messageId, userId, contenu) => {
    const msg = await getMessageById(connection, messageId);
    if (!msg) throw new Error('Message introuvable');
    if (msg.utilisateur_id !== userId) throw new Error('Action non autorisée');
    await updateMessage(connection, messageId, contenu);
    return { ...msg, contenu, is_edited: 1 };
};

const deleteMessageService = async (connection, messageId, userId, mode) => {
    const msg = await getMessageById(connection, messageId);
    if (!msg) throw new Error('Message introuvable');
    if (mode === 'everyone') {
        if (msg.utilisateur_id !== userId) throw new Error('Action non autorisée');
        await deleteMessageForAll(connection, messageId);
        return { id_message: messageId, discussion_id: msg.discussion_id, mode: 'everyone' };
    } else {
        await deleteMessageForUser(connection, messageId, userId);
        return { id_message: messageId, discussion_id: msg.discussion_id, mode: 'self', userId };
    }
};

module.exports = {
    sendMessageService,
    getChatHistoryService,
    editMessageService,
    deleteMessageService
};