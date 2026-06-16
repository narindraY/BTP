import { NavLink, useNavigate } from "react-router-dom";
import { SidebarItems } from "./SidebarItems";
import { useState } from "react";
import axios from "axios";

import Dialog from "./ui/Dialog";
import { base_url } from "../Utils/IP";

function Sidebar() {
  const [openLogout, setOpenLogout] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
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
    <aside className="w-16 sm:w-50 h-screen bg-gray-800 text-white">
      <Dialog
        isOpen={openLogout}
        title="Déconnexion"
        message="Voulez-vous vraiment vous déconnecter ?"
        onCancel={() => setOpenLogout(false)}
        onConfirm={handleLogout}
      />
      <ul className="p-4">
        {SidebarItems.map((item) => {
          const Icon = item.icon;
          if (item.path === "/logout") {
            return (
              <li key={item.path} className="mt-4">
                <button
                  onClick={() => setOpenLogout(true)}
                  className="flex items-center gap-3 rounded-lg hover:bg-[var(--hoover)] hover:text-[var(--secondary)] w-full h-8"
                >
                  <Icon size={20}  /> <span className="hidden sm:inline">{item.title}</span>
                </button>
              </li>
            );
          }

          return (
            <li key={item.path} className="mt-4">
              <NavLink
                to={item.path}
                className="flex items-center gap-3 rounded-lg hover:bg-[var(--hoover)] hover:text-[var(--secondary)] w-full h-8"
                >
                <Icon size={20} /> <span className="hidden sm:inline">
                  {item.title}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;