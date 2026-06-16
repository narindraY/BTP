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
        path:"/projets",
        title:"Projets",
        icon:FaHome,
    },
    {
        path:"/contrats",
        title:"Contrat",
        icon:FiFileText
    },
    {
        path:"/suivi",
        title:"Suivi des travaux",
        icon:FaCheck
    },
    {
        path:"/finance",
        title:"Finance",
        icon: FiDollarSign,
    },
    {
        path:"/ressources",
        title:"Ressources",
        icon:FiBook,
    },
    {
        path:"/chat",
        title: "Message",
        icon: MdMessage
    },
    {
        path:"/rapports",
        title:"Rapport",
        icon:MdAddCircleOutline,
    },
    {
        path:"/publication/list",
        title:"Publication",
        icon:FiFileText,
    },
    {
        path:"/parametres",
        title:"Parametres",
        icon:FiSettings
    },
      {
        path:"/logout",
        title:"Deconnexion",
        icon: MdLogout
    }
];

export const ItemesUsers = [
    
    {
        path:"/user",
        title:"kkk",
        icon:FaClock,
    },
    {
        path:"/setting/user",
        title:"Parametres",
        icon:FiSettings
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