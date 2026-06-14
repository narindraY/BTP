const mysql = require("mysql");
const myConnection = require("express-myconnection");

const options = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    database: process.env.DB_NAME || "btp",
    password: process.env.DB_PASSWORD || ""
};

module.exports = {
    mysql,
    myConnection,
    options
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