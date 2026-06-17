import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import { useState } from "react";
import { MdClose } from "react-icons/md";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAuth, setShowAuth] = useState(false);
  const [authView, setAuthView] = useState("login"); // "login" | "register"

  const handleContact = () => {
    if (location.pathname === "/") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/contact");
    }
  };

  const handleAbout = () => {
    if (location.pathname === "/") {
      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/about");
    }
  };

  const handlePub = () => {
    if (location.pathname === "/") {
      document.getElementById("pub")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/user/publication");
    }
  };

  const openLogin = () => {
    setAuthView("login");
    setShowAuth(true);
  };

  const closeAuth = () => {
    setShowAuth(false);
  };

  return (
    <>
      <div className="w-full h-18 bg-[var(--primary)] flex items-center justify-between px-4">
        <button onClick={() => navigate("/")} className="flex items-center gap-3">
          <img src={logo} className="w-30 h-25" />
      
        </button>
        <div>
          <button onClick={handlePub}
            className="text-white px-4 py-1 hover:bg-[var(--hoover)] cursor-pointer rounded-lg hover:text-[var(--primary)]">
            Projets
          </button>
          <button onClick={handleAbout}
            className="text-white px-4 py-1 hover:bg-[var(--hoover)] cursor-pointer rounded-lg hover:text-[var(--primary)]">
            A propos
          </button>
          <button onClick={handleContact}
            className="text-white px-4 py-1 hover:bg-[var(--hoover)] cursor-pointer rounded-lg hover:text-[var(--primary)]">
            Contactez
          </button>
          <button onClick={openLogin}
            className="text-white px-4 py-1 rounded hover:bg-[var(--hoover)] hover:text-[var(--primary)] cursor-pointer transition">
            Se connecter
          </button>
        </div>
      </div>

      {showAuth && (
        <div className="fixed inset-0 z-[100] flex justify-end mt-18">
          <div className="absolute inset-0 bg-black/50" onClick={closeAuth} />

          <div className="relative w-1/3 h-full shadow-2xl flex flex-col">
            <button onClick={closeAuth}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10">
              <MdClose size={24} className="cursor-pointer" />
            </button>

            <div className="flex-1 flex items-center justify-center p-8">
              <div className="w-full">
                {authView === "login" ? (
                  <Login onSwitchToRegister={() => setAuthView("register")} />
                ) : (
                  <Register onSwitchToLogin={() => setAuthView("login")} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;