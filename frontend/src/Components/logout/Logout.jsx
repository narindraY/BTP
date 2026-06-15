import axios from "axios";
import { base_url } from "../../Utils/IP";

function Logout() {

  const handleClick = async () => {
    try {
      await axios.post(
        `${base_url}/logout`,
        {},
        { withCredentials: true }
      );

      localStorage.removeItem("role");
      localStorage.removeItem("token");

      window.location.href = "/";
    } catch (err) {
      console.log("logout error:", err);
    }
  };

  return (
    <button onClick={handleClick}>
      Se déconnecter
    </button>
  );
}

export default Logout;