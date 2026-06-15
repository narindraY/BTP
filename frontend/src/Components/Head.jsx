import axios from "axios";
import logo from "../assets/logo.png"
import { base_url } from "../Utils/IP";
import { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
function Head() {
    const token = localStorage.getItem("token")
    const [data, setData] = useState(" ")
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${base_url}/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                setData(res.data.user)
                console.log("user success")
            } catch (error) {
                console.log('error', error)
            };
        }
        fetchProfile()
    }, [])

    return (
        <div className="w-full h-18 bg-[var(--primary)] flex justify-between items-center px-4">
            <div className="flex items-center gap-2">
                <img src={logo} className="w-12 h-12" />
                <p className="text-white text-2xl italic">Structura</p>
            </div>
            <div className="flex items-center gap-2 text-white">
                <FiUser size={18} />
                <p>{data.nom_user}</p>
            </div>

        </div>
    );
}

export default Head;