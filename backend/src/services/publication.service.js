const {createPublication, getPublication} = require("../models/publication.models");
const publication = async (connection, data) =>{
    const publicationData = {
        titre: data.titre,
        description: data.description,
        img: data.img,
        utilisateur_id: data.utilisateur_id
    };
    return await createPublication(connection, publicationData);
};
const getPub = async(connection) =>{
    return await getPublication(connection)
} 
module.exports = {publication, getPub};