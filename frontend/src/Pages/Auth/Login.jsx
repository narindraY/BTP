import axios from "axios";
import { base_url } from "../../Utils/IP";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { FiLogIn } from "react-icons/fi";

function Login({ onSwitchToRegister }) {
    const [error, setError] = useState('');
    const [data, setData] = useState({
        password: '',
        contact: ''
    });

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${base_url}/user/login`, data, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const role = res.data.user?.role;
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.user.role);
            if (role === "admin") {
                navigate("/dashboard");
            } else {
                navigate("/mes-projets");
            }
        } catch (error) {
            console.log('error', error);
            setError("Mot de passe incorrect");
        }
    };

    return (
        <div className="w-full flex flex-col items-center">
            <h2 className="text-3xl font-bold text-white mb-2">Connexion</h2>
            <p className="text-white/60 text-sm mb-8">Bienvenue, connectez-vous pour continuer</p>

            {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2.5 rounded-xl mb-4 w-72">
                    <span className="text-red-400">⚠</span>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col items-center w-full gap-4">
                <div className="relative w-72">
                    <input type="text" name="contact" value={data.contact} onChange={handleChange} placeholder=" "
                        className="peer w-full px-4 pt-6 pb-2 bg-white/10 border border-white/20 rounded-xl outline-none transition-all duration-200 text-white
                           focus:border-[var(--secondary)] focus:bg-white/15 focus:ring-2 focus:ring-[var(--secondary)]/20"/>
                    <label className="absolute left-4 top-4 text-white/50 text-base font-normal transition-all duration-200 pointer-events-none
                        peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-[var(--secondary)] peer-focus:font-medium
                        peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-white/50 peer-[&:not(:placeholder-shown)]:font-medium">
                        Contact
                    </label>
                </div>
                <div className="relative w-72">
                    <input type="password" name="password" value={data.password} onChange={handleChange} placeholder=" "
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
                       hover:bg-[var(--hoover)] hover:text-[var(--primary)] hover:border-transparent">
                    <FiLogIn className="text-base" />
                    Connexion
                </button>
            </form>

            {/* Séparateur */}
            <div className="flex items-center gap-3 w-72 my-5">
                <div className="flex-1 h-px bg-white/20" />
                <span className="text-white/40 text-xs uppercase tracking-widest">ou</span>
                <div className="flex-1 h-px bg-white/20" />
            </div>

            {/* Bouton Google */}
            <button
                onClick={() => { window.location.href = "http://localhost:3000/api/auth/google"; }}
                className="w-72 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200
                   cursor-pointer transition-all duration-200 flex items-center justify-center gap-3
                   hover:bg-gray-50 hover:shadow-md hover:scale-[1.02]"
            >
                <FcGoogle className="text-xl" />
                Continuer avec Google
            </button>

            <p className="text-white/70 text-sm flex gap-1 mt-6">
                Pas encore de compte ?
                <button
                    onClick={onSwitchToRegister}
                    className="text-[var(--secondary)] hover:underline cursor-pointer font-medium bg-transparent border-none"
                >
                    S'inscrire
                </button>
            </p>
        </div>
    );
}

export default Login;