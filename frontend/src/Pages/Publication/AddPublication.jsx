import axios from "axios";
import { useState } from "react";
import { base_url } from "../../Utils/IP";
import { useNavigate } from "react-router-dom";
import { FiFileText, FiAlignLeft, FiImage, FiUpload, FiArrowLeft } from "react-icons/fi";

function AddPublication() {
    const [data, setData] = useState({
        titre: "",
        contenu: "",
        img: null,
        statut: "actif"
    });
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.type === "file") {
            const file = e.target.files[0];
            setData({ ...data, img: file });
            if (file) setPreview(URL.createObjectURL(file));
        } else {
            setData({ ...data, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("titre", data.titre);
        formData.append("description", data.contenu);
        formData.append("img", data.img);

        try {
            await axios.post(`${base_url}/publication/create`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            navigate("/publication/list");
        } catch (error) {
            console.log("Erreur création publication", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-5 px-6">
            {/* En-tête */}
            <div className="max-w-2xl mx-auto mb-8 flex items-center gap-4">
                <button
                    onClick={() => navigate("/publication/list")}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-100 transition"
                >
                    <FiArrowLeft className="text-[var(--primary)]" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-[var(--primary)]">
                        Nouvelle publication
                    </h2>
                </div>
            </div>
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
                            <FiFileText className="text-[var(--secondary)]" />
                            Titre
                        </label>
                        <input
                            type="text"
                            name="titre"
                            value={data.titre}
                            onChange={handleChange}
                            placeholder="Titre de la publication..."
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-[var(--primary)]
                                focus:border-[var(--secondary)] focus:bg-white focus:ring-2 focus:ring-[var(--secondary)]/20 transition-all duration-200 placeholder:text-gray-300"
                        />
                    </div>

                    {/* Contenu */}
                    <div className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
                            <FiAlignLeft className="text-[var(--secondary)]" />
                            Contenu
                        </label>
                        <textarea
                            name="contenu"
                            value={data.contenu}
                            onChange={handleChange}
                            placeholder="Décrivez votre publication..."
                            required
                            rows={2}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-[var(--primary)] resize-none
                                focus:border-[var(--secondary)] focus:bg-white focus:ring-2 focus:ring-[var(--secondary)]/20 transition-all duration-200 placeholder:text-gray-300"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="flex items-center gap-1 text-sm font-semibold text-[var(--primary)]">
                            <FiImage className="text-[var(--secondary)]" />
                            Image
                        </label>

                        <label className="cursor-pointer group">
                            <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
                            {preview ? (
                                <div className="relative rounded-xl overflow-hidden border border-gray-200 w-40 h-30">
                                    <img
                                        src={preview}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                        <p className="text-white text-sm font-medium">Changer l'image</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center 
                                gap-2 hover:border-[var(--secondary)] hover:bg-gray-50 transition-all duration-200">
                                    <div className="w-8 h-5 rounded-xl bg-[var(--primary)]/5 flex items-center justify-center">
                                        <FiUpload className="text-[var(--secondary)] text-xl" />
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        <span className="text-[var(--secondary)] font-semibold">Cliquez pour uploader</span> ou glissez une image
                                    </p>
                                    <p className="text-xs text-gray-300">PNG, JPG, WEBP</p>
                                </div>
                            )}
                        </label>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate("/publication/list")}
                            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl bg-[var(--primary)] text-white font-medium flex items-center justify-center gap-2
                                hover:bg-[var(--hoover)] hover:text-[var(--primary)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <FiUpload className="text-base" />
                            )}
                            {loading ? "Publication en cours..." : "Publier"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddPublication;
