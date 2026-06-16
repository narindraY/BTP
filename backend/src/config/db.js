const mysql = require("mysql2");
const myConnection = require("express-myconnection");

const options = {
    host: "localhost",
    user: "root",
    database: "btp",
    password: ""
};

const testConnection = mysql.createConnection(options);

testConnection.connect((err) => {
    if (err) {
        console.log(" Database NOT connected:", err.message);
    } else {
        console.log("Database connected successfully!");
    }
    testConnection.end();
});

module.exports = {
    mysql,
    myConnection,
    options
};