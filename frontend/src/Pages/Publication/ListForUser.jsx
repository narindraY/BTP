import axios from "axios";
import { useEffect, useState } from "react";
import { base_url, url } from "../../Utils/IP";



function ListForUser() {
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
      } catch (error) {
        console.log("list pub error", error);
      }
    };
    fetchData();
  }, []);


  return (
    <div className="flex flex-col p-3">
      <div className="flex justify-between mb-4 shrink-0">
        <h2 className="text-2xl text-[var(--primary)] font-bold">Actualites</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1 overflow-hidden">
        {data.map((pub) => (
          <div key={pub.id_pub} className="bg-white rounded-xl shadow-md overflow-hidden">
            <img src={`${url}/uploads/${pub.img}`} alt={pub.titre}
              className=" h-30 w-full object-cover hover:scale-105 transition duration-300" />
            <div className="p-4">
              <h2 className="text-sm mb-2">{pub.titre}</h2>
              <p className="text-gray-600 text-sm line-clamp-2">{pub.contenu}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListForUser;