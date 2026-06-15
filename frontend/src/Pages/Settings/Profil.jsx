import { useEffect, useState } from "react";
import { base_url } from "../../Utils/IP";
import axios from 'axios';

function Profil() {
    const token = localStorage.getItem("token");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${base_url}/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setData(res.data.user);
            } catch (err) {
                setError(err.response?.data?.message || "Erreur lors du chargement");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (error)   return <p style={{ color: "red" }}>{error}</p>;
    if (!data)   return <p>Aucune donnée</p>;  // ← sécurité supplémentaire

    return (
        <div>
            <h2>Mon Profil</h2>
            <div>
                <p><strong>Nom :</strong> {data.nom_user}</p>
                <p><strong>Contact :</strong> {data.contact}</p>
            </div>
        </div>
    );
}

export default Profil;