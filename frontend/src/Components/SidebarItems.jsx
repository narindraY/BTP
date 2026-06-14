import { FaCheck, FaClock, FaHome } from "react-icons/fa";
import{ FiBook, FiDollarSign, FiFileText, FiHome, FiSettings} from "react-icons/fi"
import { MdAddCircleOutline, MdMessage, MdPerson } from "react-icons/md";
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
    }
];

export const ItemesUsers = [
    
    {
        path:"/user",
        title:"kkk",
        icon:FaClock,
    
    }
];