const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'BTP',
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0
});

db.getConnection((err,connection)=>{
    if(err){
        console.error('Erreur de connexion à MySQL :' , err);
        return;
    }
    console.log('Connecté à la base de données MySQL "BTP" .');
    connection.release();
});

module.exports = db.promise();