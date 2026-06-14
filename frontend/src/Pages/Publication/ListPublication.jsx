import axios from "axios";
import { useEffect, useState } from "react";
import { base_url, url } from "../../Utils/IP";
import { FiPlus, FiChevronLeft, FiChevronRight, FiMessageCircle } from "react-icons/fi";
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

  const startDiscussion = async (auteur_id) => {
    try {
      const res = await axios.post(`${base_url}/chat/start`, { client_id: auteur_id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/chat");
    } catch (error) {
      console.error("Erreur start chat:", error);
    }
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 flex-1 overflow-hidden">
        {currentData.map((pub) => (
          <div key={pub.id_publication} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="relative overflow-hidden h-40">
              <img src={`${url}/uploads/${pub.img}`} alt={pub.titre}
                className="h-40 w-full object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => startDiscussion(pub.utilisateur_id)}
                  className="bg-white p-2 rounded-full text-indigo-600 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  title="Contacter l'auteur"
                >
                  <FiMessageCircle size={24} />
                </button>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-sm font-bold text-gray-800 line-clamp-1">{pub.titre}</h2>
              </div>
              <p className="text-gray-600 text-[12px] line-clamp-2 mb-3 flex-1">{pub.description || pub.contenu}</p>
              <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                <span className="text-[10px] text-gray-400 italic">Par {pub.auteur_nom || 'Anonyme'}</span>
                <button 
                  onClick={() => startDiscussion(pub.utilisateur_id)}
                  className="text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <FiMessageCircle size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 shrink-0">
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