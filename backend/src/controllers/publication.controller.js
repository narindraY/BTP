const {publication, getPub} = require("../services/publication.service");
const auth = require("../middleware/auth"); // Si besoin mais il est déjà protégé par la route

const createPub = (req, res) => {
  req.getConnection(async (err, connection) => {
    if (err) {
      return res.status(500).json({ message: "error trop be" });
    }

    try {
      const data = {
        titre: req.body.titre,
        description: req.body.description || req.body.contenu, // Support des deux noms
        img: req.file ? req.file.filename : null,
        utilisateur_id: req.user ? req.user.id : null // On récupère l'ID de l'utilisateur connecté via le middleware auth
      };

      await publication(connection, data);

      res.status(200).json({ message: "pub create succes" });

    } catch (error) {
      res.status(500).json({ message: error.message || "errorrrrr" });
    }
  });
};
const listPub = (req, res) => {
  req.getConnection(async (err, connection) => {
    if (err) {
      return res.status(500).json({ message: "erreur" });
    }

    try {
      const result = await getPub(connection);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};
module.exports = {createPub, listPub};