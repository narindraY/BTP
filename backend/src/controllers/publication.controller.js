const {publication, getPub} = require("../services/publication.service");
const createPub = (req, res) => {
  req.getConnection(async (err, connection) => {
    if (err) {
      return res.status(500).json({ message: "error trop be" });
    }

    try {
      const data = {
        titre: req.body.titre,
        contenu: req.body.contenu,
        statut: req.body.statut,
        img: req.file ? req.file.filename : null,
      };

      await publication(connection, data);

      res.status(200).json({ message: "pub create succes" });

      console.log("FILE:", req.file);
      console.log("BODY:", req.body);

    } catch (error) {
      res.status(500).json({ message: "errorrrrr" });
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