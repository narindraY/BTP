const { createPublication, getPublication, updatePublication, deletePublication } = require("../models/publication.models");

const publication = async (data) => {
  const publicationData = {
    titre: data.titre,
    description: data.description,
    img: data.img,
    utilisateur_id: data.utilisateur_id
  };
  return await createPublication(publicationData);
};

const getPub = async () => {
  return await getPublication();
};

const updatePub = async (id, data) => {
  const updateData = {};
  if (data.titre) updateData.titre = data.titre;
  if (data.description) updateData.description = data.description;
  if (data.img) updateData.img = data.img;
  return await updatePublication(id, updateData);
};

const deletePub = async (id) => {
  return await deletePublication(id);
};

module.exports = { publication, getPub, updatePub, deletePub };
