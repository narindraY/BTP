import { FaCheck, FaClock, FaHome } from "react-icons/fa";
import{ FiBook, FiDollarSign, FiFileText, FiHome, FiSettings} from "react-icons/fi"
import { MdAddCircleOutline, MdLogout, MdMessage, MdPerson } from "react-icons/md";

export const SidebarItems = [
    {
        path:"/dashboard",
        title:"Tableau de bord",
        icon: FiHome,
    },
    {
        path:"/contrats",
        title:"Contrat",
        icon:FiFileText
    },
    {
        path:"/projets",
        title:"Projets",
        icon:FaHome,
    },
    {
        path:"/suivi",
        title:"Suivi des travaux",
        icon:FaCheck
    },
    {
        path:"/ressources",
        title:"Ressources",
        icon:FiBook,
    },
    {
        path:"/finance",
        title:"Finance",
        icon: FiDollarSign,
    },
    {
        path:"/chat",
        title: "Message",
        icon: MdMessage
    },
    {
        path:"/publication/list",
        title:"Publication",
        icon:FiFileText,
    },
      {
        path:"/logout",
        title:"Deconnexion",
        icon: MdLogout
    }
];

export const ItemesUsers = [
    {
        path:"/mes-projets",
        title:"Projets",
        icon: FiHome,
    },
      {
        path:"/chat/user",
        title: "Message",
        icon: MdMessage
    },
      {
        path:"/pub/user",
        title:"Actualites",
        icon:FiFileText,
    },
    {
        path:"/logout/user",
        title:"Deconnexion",
        icon: MdLogout
    }
];