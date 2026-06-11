import { useEffect, useState } from "react";
import Header from "./Components/Header";
import axios from "axios";
import { base_url } from "./Utils/IP";
import bg from "./assets/bg.png";
import Login from "./Pages/Auth/Login";
import { MdClose } from "react-icons/md";

function Client() {
  const [showLogin, setShowLogin] = useState(false);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${base_url}/publication/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setData(res.data);
        console.log("list pub success");
      } catch (error) {
        console.log("list pub error", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="w-full">
      <div className="fixed top-0 left-0 w-full z-50">
        <Header onLoginClick={() => setShowLogin(true)} />
      </div>
      <div className="bg-cover bg-center min-h-screen pt-20 flex" style={{ background: `url(${bg})` }}>
        <div className="w-1/2 ml-16 space-y-6" >
          <h1 className="text-6xl text-white font-bold mt-8">Structura <br /> construction</h1>
          <p className="text-3xl text-white font-bold"> De l’idée à l’ouvrage, nous structurons vos projets...</p>
          <div className="flex gap-6">
            <button className="w-36 h-16 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--hoover)] hover:text-[var(--primary)] cursor-pointer">Voir nos projets</button>
            <button className="w-36 h-16 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--hoover)] hover:text-[var(--primary)] cursor-pointer">Nous contacter</button>
          </div>
        </div>
        {showLogin && (
          <div className="w-1/2 flex items-center justify-center bg-black/40">
            <div className="p-6 rounded-xl w-96 shadow-lg relative">
              <button onClick={() => setShowLogin(false)} className="absolute top-2 right-3 text-gray-500"> <MdClose size={22} color="white" className="cursor-pointer"/> </button>
              <Login />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default Client;

/**
 *           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
                      {data.slice(0,3).map((pub) => (
                        <div
                          key={pub.id_pub}
                          className="bg-white rounded-xl shadow-md overflow-hidden"
                        >
                          <img
                            src={`${url}/uploads/${pub.img}`}
                            alt={pub.titre}
                            className="w-full h-40 object-cover"
                          />
                          <div className="p-4">
                            <h2 className="text-lg font-bold mb-2">{pub.titre}</h2>
                            <p className="text-gray-600">{pub.contenu}</p>
                          </div>
                        </div>
                      ))}
                    </div>
 */