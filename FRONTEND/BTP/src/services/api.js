import axios from "axios";


const API = axios.create({
  baseURL: "http://localhost:5000/api", 
});


export const getContrats = () => API.get("/contrats");
export const getContratById = (id) => API.get(`/contrats/${id}`);
export const addContrat = (data) => API.post("/contrats", data);
export const updateContrat = (id, data) => API.put(`/contrats/${id}`, data);
export const deleteContrat = (id) => API.delete(`/contrats/${id}`);


export const getRapportJournalier = (date) =>
  API.get(`/rapports/journalier/pdf?date=${date}`, { responseType: "blob" });

export const getRapportMensuel = (month, year) =>
  API.get(`/rapports/mensuel/pdf?month=${month}&year=${year}`, { responseType: "blob" });

export const getRapportFinancier = () =>
  API.get("/rapports/financier/pdf", { responseType: "blob" });


export const getSuivis = (search = "") => API.get(`/suivis?search=${search}`);
export const getSuiviById = (id) => API.get(`/suivis/id/${id}`);   
export const addSuivi = (data) => API.post("/suivis", data);
export const updateSuivi = (id, data) => API.put(`/suivis/${id}`, data);
export const deleteSuivi = (id) => API.delete(`/suivis/${id}`);


export const getDashboardStats = () => API.get("/dashboard");

export default API;
