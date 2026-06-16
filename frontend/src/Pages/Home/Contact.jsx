import { useState } from "react";
import { FiPhone, FiMail, FiMapPin, FiSend, FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import { base_url } from "../../Utils/IP";

function Contact() {
    const [form, setForm] = useState({ nom: "", email: "", message: "" });
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await axios.post(`${base_url}/send/contact`, form, {
                headers: { "Content-Type": "application/json" }
            });
            setSent(true);
            setForm({ nom: "", email: "", message: "" });
        } catch (err) {
            setError("mbola tsy vita tsara le back,kkkkkkkkk.", err);
        } finally {
            setLoading(false);
        }
    };
    const infos = [
        {
            icon: <FiPhone className="text-[var(--secondary)] text-xl" />,
            label: "Téléphone",
            value: "+261 34 45 654 78",
        },
        {
            icon: <FiMail className="text-[var(--secondary)] text-xl" />,
            label: "Email",
            value: "contact@structura.mg",
        },
        {
            icon: <FiMapPin className="text-[var(--secondary)] text-xl" />,
            label: "Adresse",
            value: "301 Fianarantsoa, Madagascar",
        },
    ];

    return (
        <div className="px-8 py-4">
            <div className="flex items-end gap-4 mb-10">
                <div>
                    <h2 className="text-4xl font-bold text-[var(--primary)]">
                        Nous contacter
                    </h2>
                </div>
                <div className="flex-1 h-px bg-gray-200 mb-2" />
            </div>
            <div className="flex gap-10">
                <div className="flex flex-col gap-6 w-1/3">
                    <p className="text-gray-500 text-sm leading-relaxed">Vous avez un projet en tête ? N'hésitez pas à nous contacter, notre équipe vous répondra dans les plus brefs délais.</p>
                    {infos.map((info) => (
                        <div key={info.label} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 shadow-sm bg-white">
                            <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/5 flex items-center justify-center flex-shrink-0">{info.icon}</div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{info.label}</p>
                                <p className="text-[var(--primary)] font-semibold text-sm">{info.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    {sent ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-10">
                            <FiCheckCircle className="text-5xl text-green-500" />
                            <h3 className="text-xl font-bold text-[var(--primary)]">Message envoyé !</h3>
                            <p className="text-gray-400 text-sm">Nous avons bien reçu votre message et reviendrons vers vous rapidement.</p>
                            <button onClick={() => setSent(false)} className="mt-2 px-6 py-2.5 rounded-xl border-2 border-[var(--primary)] text-[var(--primary)] text-sm font-semibold hover:bg-[var(--primary)] hover:text-white transition-all duration-300">
                                Envoyer un autre message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            {error && (
                                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-500 text-sm px-4 py-2.5 rounded-xl">
                                    <span>kkkk</span> {error}
                                </div>
                            )}
                            <div className="relative">
                                <input type="text" name="nom" value={form.nom} onChange={handleChange} required placeholder=" "
                                    className="peer w-full px-4 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all duration-200
                                       focus:border-[var(--secondary)] focus:bg-white focus:ring-2 focus:ring-[var(--secondary)]/20"/>
                                <label className="absolute left-4 top-4 text-gray-400 text-base transition-all duration-200 pointer-events-none
                                    peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-[var(--secondary)] peer-focus:font-medium
                                    peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-gray-400 peer-[&:not(:placeholder-shown)]:font-medium">
                                    Votre nom
                                </label>
                            </div>
                            <div className="relative">
                                <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder=" "
                                    className="peer w-full px-4 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all duration-200
                                       focus:border-[var(--secondary)] focus:bg-white focus:ring-2 focus:ring-[var(--secondary)]/20"/>
                                <label className="absolute left-4 top-4 text-gray-400 text-base transition-all duration-200 pointer-events-none
                                    peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-[var(--secondary)] peer-focus:font-medium
                                    peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-gray-400 peer-[&:not(:placeholder-shown)]:font-medium">
                                    Votre email
                                </label>
                            </div>
                            <div className="relative">
                                <textarea name="message" value={form.message} onChange={handleChange} required placeholder=" " rows={2}
                                    className="peer w-full px-1 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all duration-200 resize-none
                                       focus:border-[var(--secondary)] focus:bg-white focus:ring-2 focus:ring-[var(--secondary)]/20"/>
                                <label className="absolute left-4 top-4 text-gray-400 text-base transition-all duration-200 pointer-events-none
                                    peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-[var(--secondary)] peer-focus:font-medium
                                    peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-gray-400 peer-[&:not(:placeholder-shown)]:font-medium">
                                    Votre message
                                </label>
                            </div>

                            <button type="submit" disabled={loading}
                                className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[var(--primary)] text-white font-medium
                                   hover:bg-[var(--hoover)] hover:text-[var(--primary)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading ? (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <FiSend className="text-base" />
                                )}
                                {loading ? "Envoi en cours..." : "Envoyer le message"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Contact;