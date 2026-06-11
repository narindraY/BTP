import axios from "axios";
import { useEffect, useState } from "react";
import { base_url, url } from "../../Utils/IP";
import { FiPlus } from "react-icons/fi";
import {useNavigate} from "react-router-dom"

function ListPublication() {
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
  const navigate = useNavigate()

  return (
   <div>
     <div className="flex justify-between mb-4">
    <h2 className="text-2xl text-[var(--primary)] font-bold items-center text-center">
      Publication
    </h2>

    <button onClick={()=>{navigate("/publication/create")}} className="flex items-center justify-between gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--hoover)] hover:text-[var(--primary)] ">
      <FiPlus size={18} />
      Créer
    </button>
  </div>
     <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
      {data.map((pub) => (
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
   </div>
  );
}

export default ListPublication;