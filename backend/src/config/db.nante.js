
const mysql = require("mysql2");

const db = mysql.createConnection({
   host: "localhost",
    user: "root",
    database: "btp",
    password: ""
});


db.connect((err) => {
  if (err) {
    console.error(" Erreur de connexion MySQL:", err.message);
  } else {
    console.log(" Connecté à la base MySQL");
  }
});

module.exports = db;