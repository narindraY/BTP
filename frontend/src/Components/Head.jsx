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
        <div className="w-full h-18 bg-gray-200 flex justify-between items-center px-4">
            <div className="flex items-center gap-2">
                <img src={logo} className="w-50 h-25" />
                
            </div>
            <div className="flex items-center font-bold gap-2 text-gray-800">
                <FiUser size={18} />
                <p>{data.nom_user}</p>
            </div>

        </div>
    );
}

export default Head;