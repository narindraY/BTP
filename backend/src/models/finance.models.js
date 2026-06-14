const findBudget = (connection) =>{
    return new Promise((resolve, reject)=>{
        connection.query("SELECT p.id_projet, p.nom_projet, c.budget FROM projet p JOIN contrat c on p.contrat_id = c.id_contrat",
            (err, result) =>{
                if (err) {
                    return reject(err);
                }
                resolve(result)
            }
        );
    });
};
const findDSpending = (connection) =>{
    return new Promise((resolve, reject) =>{
        connection.query("SELECT SUM(quantite * prix_unitaire) AS spending FROM ressource",
            (err, result) =>{
                if (err) {
                    return reject(err);
                }
                resolve(result)
            }
        );
    });
};

const findBalance = (connection) =>{
    return new Promise((resolve, reject)=>{
        connection.query("SELECT c.budget - COALESCE(SUM(r.quantite * r.prix_unitaire), 0) AS reste_budget FROM projet p JOIN contrat c ON p.contrat_id = c.id_contrat LEFT JOIN ressource r ON r.projet_id = p.id_projet GROUP BY c.budget",
    (err, result) => {
        if (err) {
            return reject(err);
        }
        resolve(result)
    }
        );
});
};
module.exports = {findBudget, findDSpending, findBalance}; 