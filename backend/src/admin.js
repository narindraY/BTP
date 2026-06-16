const bcrypt = require("bcrypt");
const mysql = require("mysql");
const {options} = require("../src/config/db.narindra");
//const connection = require("express-myconnection");

const connection = mysql.createConnection(options);
connection.connect();
const createAdmin = async() => {
    const hashPasseword = await bcrypt.hash("admin1234", 10);
    connection.query(`INSERT INTO user (nom_user, contact, password, role) VALUES (?, ?, ?, ?)`,
        ["administrator", [1234567870], hashPasseword, "admin" ],
     (err, result) =>{
        if (err) {
            console.log("error", err.message);
            return;
        }
        console.log("admin created successfully!");
        connection.end();
     })
};
createAdmin();