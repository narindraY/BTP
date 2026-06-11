const {createPublication, getPublication} = require("../models/publication.models");
const publication = async (connection, data) =>{
    const publicationData = {
        titre: data.titre,
        contenu: data.contenu,
        img: data.img,
        statut: data.statut
    };
    return await createPublication(connection, publicationData);
};
const getPub = async(connection) =>{
    return await getPublication(connection)
} 
module.exports = {publication, getPub};