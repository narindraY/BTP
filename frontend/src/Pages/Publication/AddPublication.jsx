import axios from "axios";
import { useState } from "react";
import { base_url } from "../../Utils/IP";
import {useNavigate} from "react-router-dom";

function AddPublication() {
    const [data, setData] = useState({
        titre:" ",
        contenu: " ",
        img:null ,
        statut:" "
    });
    const navigate = useNavigate()
   const handleChange = (e) => {
    if (e.target.type === "file") {
        setData({
            ...data,
           img: e.target.files[0]
        });
    } else {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }
};
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append("titre", data.titre);
        formData.append("contenu", data.contenu);
        formData.append("statut", data.statut);
        formData.append("img", data.img)
        try {
            const res = await axios.post(`${base_url}/publication/create`, formData, {
                headers:{
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            })
            console.log('create publication success', res.data)
            navigate("/publication/list")
        } catch (error) {
            console.log('error create pub', error)
        }
    }
    return ( 
        <div>
            <h2 className="text-center">Creation du publication</h2>
            <form className="flex flex-col items-center justify-center ">
                <label htmlFor="titre" className="text-xl">Titre</label>
                <input type="text" name="titre" value={data.titre} onChange={handleChange}
                className="border p-2 rounded-lg"/>
                <label htmlFor="contenu" className="text-xl">Contenu</label>
                <input type="text" name="contenu" value={data.contenu} onChange={handleChange}
                className="border p-2 rounded-lg"/>
                <label htmlFor="img" className="text-xl">Image</label>
                <input type="file" onChange={handleChange}
                className="border p-2 rounded-lg"/>
                <button onClick={handleSubmit} className="mt-4 p-2 w-35 ronded rounded-lg bg-[var(--secondary)] hover:bg-[var(--bg)]">Publier</button>
            </form>
        </div>
     );
}

export default AddPublication;