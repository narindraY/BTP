import axios from "axios";
import { base_url } from "../../Utils/IP";
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

function Login() {
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
                navigate("/publication/list");
            } else {
                navigate("/user");
            }
        } catch (error) {
            console.log('error', error);
            setError("Mot de passe incorrect");
        }
    };

    return (
        <div className="w-full flex flex-col items-center">
            <h2 className="text-3xl font-bold text-white mb-8">Connexion</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-full gap-5">

                {/* Champ Contact */}
                <div className="relative w-72">
                    <input type="text" name="contact" value={data.contact} onChange={handleChange} placeholder=" "
                        className="peer w-full px-4 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all duration-200
                           focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary)]/20"/>
                    <label className="absolute left-4 top-4 text-gray-400 text-base font-normal transition-all duration-200 pointer-events-nonepeer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-[var(--primary)] peer-focus:font-medium
                              peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-gray-400 peer-[&:not(:placeholder-shown)]:font-medium">
                        Contact
                    </label>
                </div>

                {/* Champ Mot de passe */}
                <div className="relative w-72">
                    <input type="password" name="password" value={data.password} onChange={handleChange} placeholder=" "
                        className="peer w-full px-4 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all duration-200
                           focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary)]/20"/>
                    <label className="absolute left-4 top-4 text-gray-400 text-base font-normal transition-all duration-200 pointer-events-none peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-[var(--primary)] peer-focus:font-medium
                              peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-gray-400 peer-[&:not(:placeholder-shown)]:font-medium">
                        Mot de passe
                    </label>
                </div>

                <button type="submit"
                    className="w-72 py-3 text-white font-medium rounded-xl bg-[var(--primary)]
                       cursor-pointer transition-all duration-200
                       hover:bg-[var(--hoover)] hover:text-[var(--primary)]">
                    Connexion
                </button>
            </form>
            <p className="text-white flex mr-0.5 ">Si vous n'avez pas une compte veuillez <Link to={"/register"} className="text-[var(--secondary)] cursor-pointer"> S'inscrire</Link></p>
        </div>
    );
}

export default Login;