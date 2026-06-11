import axios from "axios";
import {base_url} from "../../Utils/IP";
import { useState } from "react";
import Head from "../../Components/Head";
function Register() {
    const [form, setForm] = useState({
        nom_user:"",
        contact:"",
        password:""
    });
    const [message, setmessage] = useState(" ");
    const handleChange = (e) => {
        setForm({...form, [e.target.name]:e.target.value})
    }
    const handleSubmit = async (ee) =>{
        ee.preventDefault();
       try {
         const response = await axios.post(`${base_url}/user/register`,form,{
            "Content-Type": "application/json"
        })
        console.log("register success:", response.data)
       } catch (error) {
        console.log(error)
        setmessage("erreur lors de la creation, champs manquants ou invalide")
       }
    }
    return ( 
        <div>
            <Head/>
            <div>
            <h2 className="items-center justify-center flex text-3xl font-bold text-var[(--secondary)] mb-6 ">Inscription</h2>
            <form className="flex flex-col items-center justify-center">
             <label className="text-xl">Nom utilisateur</label>
             <input type="text" name="nom_user" value={form.nom_user} onChange={handleChange} required
             className="border p-2  rounded-lg w-64" />
             <label className="text-xl">Contact</label>
             <input type="text" name="contact" value={form.contact} onChange={handleChange} required
             className="border p-2  rounded-lg w-64"/>
             <label className="text-xl">Password</label>
             <input type="password" name="password" value={form.password} onChange={handleChange}required
             className="border p-2  rounded-lg w-64"/>
             <button onClick={handleSubmit} className="mt-4 p-2 w-35 ronded rounded-lg bg-[var(--secondary)] hover:bg-[var(--bg)]">S'inscrire</button>
             <p>{message}</p>
            </form>
            </div>

        </div>
    )
}

export default Register;