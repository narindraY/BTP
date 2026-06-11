const {getBudget, getSpend, getBalance} = require("../services/finance.service");

const getBudgetInit = (req, res) =>{
    req.getConnection(async(err, connection)=>{
        if (err) {
            return res.status(500).json(err);
        }
        try {
           const budget = await getBudget(connection);
           res.status(200).json(budget) 
        } catch (error) {
            res.status(500).json(error)
        }
    });
};
const getSpendProject = (req, res) =>{
    req.getConnection(async(err, connection) =>{
        if (err) {
            return res.status(500).json(err)
        }
        try {
            const spent = await getSpend(connection);
            res.status(200).json(spent)
            
        } catch (error) {
            res.status(500).json(error)
        }
    })
};
const getBalaceProject = (req, res) =>{
    req.getConnection(async(err, connection)=>{
        if (err) {
           return res.status(500).json(err) 
        }
        try {
            const balance = await getBalance(connection);
            res.status(200).json(balance)
        } catch (error) {
            res.status(500).json(error)
        }
    })
}
module.exports = {getBudgetInit,getSpendProject, getBalaceProject}; 