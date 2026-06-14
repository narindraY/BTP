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
        // Joined with projet and contrat to get budget, ressource is joined with tache_ressource and tache to associate with projet
        connection.query("SELECT c.budget - COALESCE(SUM(tr.quantite_utilisee * r.prix_unitaire), 0) AS reste_budget FROM projet p JOIN contrat c ON p.contrat_id = c.id_contrat LEFT JOIN tache t ON t.projet_id = p.id_projet LEFT JOIN tache_ressource tr ON tr.tache_id = t.id_tache LEFT JOIN ressource r ON r.id_ressource = tr.ressource_id GROUP BY p.id_projet, c.budget",
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