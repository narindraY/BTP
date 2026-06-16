const { pool: db } = require('../config/db');

const createPublication = async (data) => {
  const [res] = await db.query("INSERT INTO publication SET ?", [data]);
  return res;
};

const getPublication = async () => {
  const sql = `
    SELECT p.*, u.nom as auteur_nom
    FROM publication p
    LEFT JOIN utilisateur u ON p.utilisateur_id = u.id_utilisateur
  `;
  const [rows] = await db.query(sql);
  return rows;
};

const updatePublication = async (id, data) => {
  const [res] = await db.query("UPDATE publication SET ? WHERE id_publication = ?", [data, id]);
  return res;
};

const deletePublication = async (id) => {
  const [res] = await db.query("DELETE FROM publication WHERE id_publication = ?", [id]);
  return res;
};

module.exports = { createPublication, getPublication, updatePublication, deletePublication };
