import axios from "axios";
import {base_url} from "../../Utils/IP";
import { useState } from "react";

function Register({onSwitchToLogin}) {
    const [form, setForm] = useState({
        nom: "",
        email: "",
        contact: "",
        password: ""
    });
    const [message, setMessage] = useState("");
    
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${base_url}/user/register`, form, {
                headers: { "Content-Type": "application/json" }
            });
            console.log("register success:", response.data);
            setMessage("Compte créé avec succès !");
        } catch (error) {
            console.log(error);
            setMessage("Erreur lors de la création, vérifiez les champs.");
        }
    }

    return ( 
        <div className="w-full flex flex-col items-center">
            <h2 className="text-3xl font-bold text-white mb-2">Inscription</h2>
            <p className="text-white/60 text-sm mb-8">Créez votre compte pour commencer</p>

            {message && (
                <div className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl mb-4 w-72 ${
                    message.includes('succès') ? 'text-green-400' : 'text-red-400'
                }`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col items-center w-full gap-4">
                <div className="relative w-72">
                    <input type="text" name="nom" value={form.nom} onChange={handleChange} required placeholder=" "
                        className="peer w-full px-4 pt-6 pb-2 bg-white/10 border border-white/20 rounded-xl outline-none transition-all duration-200 text-white
                           focus:border-[var(--secondary)] focus:bg-white/15 focus:ring-2 focus:ring-[var(--secondary)]/20"/>
                    <label className="absolute left-4 top-4 text-white/50 text-base font-normal transition-all duration-200 pointer-events-none
                        peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-[var(--secondary)] peer-focus:font-medium
                        peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-white/50 peer-[&:not(:placeholder-shown)]:font-medium">
                        Nom complet
                    </label>
                </div>

                <div className="relative w-72">
                    <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder=" "
                        className="peer w-full px-4 pt-6 pb-2 bg-white/10 border border-white/20 rounded-xl outline-none transition-all duration-200 text-white
                           focus:border-[var(--secondary)] focus:bg-white/15 focus:ring-2 focus:ring-[var(--secondary)]/20"/>
                    <label className="absolute left-4 top-4 text-white/50 text-base font-normal transition-all duration-200 pointer-events-none
                        peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-[var(--secondary)] peer-focus:font-medium
                        peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-white/50 peer-[&:not(:placeholder-shown)]:font-medium">
                        Adresse Email
                    </label>
                </div>

                <div className="relative w-72">
                    <input type="text" name="contact" value={form.contact} onChange={handleChange} required placeholder=" "
                        className="peer w-full px-4 pt-6 pb-2 bg-white/10 border border-white/20 rounded-xl outline-none transition-all duration-200 text-white
                           focus:border-[var(--secondary)] focus:bg-white/15 focus:ring-2 focus:ring-[var(--secondary)]/20"/>
                    <label className="absolute left-4 top-4 text-white/50 text-base font-normal transition-all duration-200 pointer-events-none
                        peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-[var(--secondary)] peer-focus:font-medium
                        peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-white/50 peer-[&:not(:placeholder-shown)]:font-medium">
                        Contact (Tél)
                    </label>
                </div>

                <div className="relative w-72">
                    <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder=" "
                        className="peer w-full px-4 pt-6 pb-2 bg-white/10 border border-white/20 rounded-xl outline-none transition-all duration-200 text-white
                           focus:border-[var(--secondary)] focus:bg-white/15 focus:ring-2 focus:ring-[var(--secondary)]/20"/>
                    <label className="absolute left-4 top-4 text-white/50 text-base font-normal transition-all duration-200 pointer-events-none
                        peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-[var(--secondary)] peer-focus:font-medium
                        peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-white/50 peer-[&:not(:placeholder-shown)]:font-medium">
                        Mot de passe
                    </label>
                </div>

                <button type="submit"
                    className="w-72 py-3 text-white font-medium rounded-xl bg-[var(--primary)] border border-white/20
                       cursor-pointer transition-all duration-200 flex items-center justify-center gap-2
                       hover:bg-[var(--hoover)] hover:text-[var(--primary)] hover:border-transparent mt-1">
                    S'inscrire
                </button>
            </form>

            <p className="text-white/70 text-sm flex gap-1 mt-6">
                Déjà un compte ?
                <button onClick={onSwitchToLogin}
                    className="text-[var(--secondary)] hover:underline cursor-pointer font-medium bg-transparent border-none">
                    Se connecter
                </button>
            </p>
        </div>
    )
}

export default Register;
