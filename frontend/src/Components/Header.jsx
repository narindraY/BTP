
import logo from "../assets/logo.png";

//import {useNavigate} from "react-router-dom"
function Header({ onLoginClick }) {
  return (
    <div className="w-full h-18 bg-[var(--primary)] flex items-center justify-between px-4">

      <div className="flex items-center gap-3">
        <img src={logo} className="w-20 h-20" />
        <p className="text-white text-2xl italic">Structura</p>
      </div>
      <div>
        <button className="text-white px-4 py-1 hover:bg-[var(--hoover)] cursor-pointer rounded-lg hover:text-[var(--primary)] ">Projets</button>
        <button className="text-white px-4 py-1 hover:bg-[var(--hoover)] cursor-pointer rounded-lg hover:text-[var(--primary)] ">A propos</button>
        <button className="text-white px-4 py-1 hover:bg-[var(--hoover)] cursor-pointer rounded-lg hover:text-[var(--primary)]  "> Contactez</button>
      <button onClick={onLoginClick}
        className="text-white px-4 py-1 rounded hover:bg-[var(--hoover)] hover:text-[var(--primary)] cursor-pointer transition">
        Se connecter
      </button>
      </div>

    </div>
  );
}
export default Header;