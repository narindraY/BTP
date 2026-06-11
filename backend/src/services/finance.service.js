const {findBudget, findDSpending, findBalance} = require("../models/finance.models");
const getBudget = async(connection) =>{
    return await findBudget(connection);
};
const getSpend = async(connection)=>{
    return await findDSpending(connection);
};
const getBalance = async(connection) =>{
    return await findBalance(connection);
};

module.exports = {getBudget, getSpend, getBalance};