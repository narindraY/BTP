import axios from "axios";
import { useEffect, useState } from "react";
import { base_url, url } from "../../Utils/IP";
import { FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

function ListPublication() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="flex flex-col p-3">
      <div className="flex justify-between mb-4 shrink-0">
        <h2 className="text-2xl text-[var(--primary)] font-bold">Publication</h2>
        <button onClick={() => navigate("/publication/create")}
          className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--hoover)] hover:text-[var(--primary)]">
          <FiPlus size={18} />Créer</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1 overflow-hidden">
        {currentData.map((pub) => (
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
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-2 shrink-0">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"><FiChevronLeft size={16} /></button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button key={page} onClick={() => goToPage(page)} className={`w-9 h-9 rounded-lg text-sm font-medium border transition ${currentPage === page ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                : "border-gray-300 hover:bg-gray-100 text-gray-700"}`}>{page}</button>
          ))}
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
            <FiChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default ListPublication;