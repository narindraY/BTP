import axios from "axios";
import { useEffect, useState } from "react";
import { base_url, url } from "../../Utils/IP";
import { FiFileText, FiGrid, FiMinus } from "react-icons/fi";

function List() {
    const [data, setData] = useState([]);
    const [showAll, setShowAll] = useState(false);
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

    const CardPub = ({ pub }) => (
        <div className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer border border-gray-100">
            <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                    src={`${url}/uploads/${pub.img}`}
                    alt={pub.titre}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                />
            </div>
            <div className="absolute inset-0 bg-[var(--primary)]/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 mb-2">
                        <FiFileText className="text-[var(--hoover)] text-lg flex-shrink-0" />
                        <h2 className="text-white text-sm font-bold leading-tight">{pub.titre}</h2>
                    </div>
                    <p className="text-white/80 text-xs leading-relaxed line-clamp-3">{pub.contenu}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="px-8 py-4">
                    <div className="flex items-end gap-4 mb-10">
                <div>
                    <h2 className="text-4xl font-bold text-[var(--primary)]">
                        Nos projets
                    </h2>
                </div>
                <div className="flex-1 h-px bg-gray-200 mb-2" />
            </div>
            <div className="grid grid-cols-3 gap-6 mt-8">
                {data.slice(0, 3).map((pub) => (
                    <CardPub key={pub.id_pub} pub={pub} />
                ))}
            </div>
            {data.length > 3 && (
                <>
                    {showAll && (
                        <div className="grid grid-cols-3 gap-6 mt-6">
                            {data.slice(3).map((pub) => (
                                <CardPub key={pub.id_pub} pub={pub} />
                            ))}
                        </div>
                    )}
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="group flex items-center gap-2.5 px-7 py-3 rounded-xl border-2 border-[var(--primary)] text-[var(--primary)] text-sm font-semibold hover:bg-[var(--primary)] hover:text-white transition-all duration-300"
                        >
                            {showAll
                                ? <FiMinus className="text-base transition-transform duration-300 group-hover:rotate-90" />
                                : <FiGrid className="text-base transition-transform duration-300 group-hover:rotate-12" />
                            }
                            {showAll ? "Réduire" : `Voir tout — ${data.length - 3} projets de plus`}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default List;