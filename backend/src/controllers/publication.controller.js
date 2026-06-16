const { publication, getPub, updatePub, deletePub } = require("../services/publication.service");

const createPub = async (req, res) => {
  try {
    const data = {
      titre: req.body.titre,
      description: req.body.description || req.body.contenu,
      img: req.file ? req.file.filename : null,
      utilisateur_id: req.user ? req.user.id : null
    };
    await publication(data);
    res.status(200).json({ message: "pub create succes" });
  } catch (error) {
    res.status(500).json({ message: error.message || "errorrrrr" });
  }
};

const listPub = async (req, res) => {
  try {
    const result = await getPub();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editPub = async (req, res) => {
  try {
    const data = {
      titre: req.body.titre,
      description: req.body.description || req.body.contenu,
    };
    if (req.file) data.img = req.file.filename;
    await updatePub(req.params.id, data);
    res.status(200).json({ message: "Publication modifiée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removePub = async (req, res) => {
  try {
    await deletePub(req.params.id);
    res.status(200).json({ message: "Publication supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPub, listPub, editPub, removePub };
