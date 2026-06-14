const createPublication = (connection, data) =>{
        return new Promise((resolve, reject) => {
        connection.query(
            "INSERT INTO publication SET ?", data,(err, res)=>{
                if (err) return reject(err);
                resolve(res);
            }
        );
    });
};
const getPublication = (connection, data) =>{
        return new Promise((resolve, reject)=>{
            const sql = `
                SELECT p.*, u.nom as auteur_nom 
                FROM publication p 
                LEFT JOIN utilisateur u ON p.utilisateur_id = u.id_utilisateur
            `;
            connection.query(sql, (err, res) =>{
                if (err) return reject(err)
                resolve(res)}
            )
        })
    
}
module.exports = {createPublication, getPublication} 