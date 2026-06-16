import axios from "axios";
import { base_url } from "../../Utils/IP";
import Dialog from "../ui/Dialog";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(true); // Ouvre le dialog dès que le composant est monté
  }, []);

  const handleClick = async () => {
    try {
      await axios.post(`${base_url}/logout`, {}, { withCredentials: true });
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      console.log("logout error:", err);
    }
  };

  return (
    <Dialog
      isOpen={open}
      title="Déconnexion"
      message="Voulez-vous vraiment vous déconnecter ?"
      onCancel={() => {
        setOpen(false);
        navigate(-1); 
      }}
      onConfirm={handleClick}
    />
  );
}

export default Logout;