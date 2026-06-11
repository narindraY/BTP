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
            connection.query("SELECT * FROM publication",
                (err, res) =>{
                if (err) return reject(err)
                resolve(res)}
            )
        })
    
}
module.exports = {createPublication, getPublication} 