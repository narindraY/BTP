import {NavLink} from "react-router-dom";
import { SidebarItems} from "./SidebarItems";
function Sidebar() {
    return ( 
        <aside className="w-48 h-screen bg-gray-800 text-white">
            <ul className="p-4">{
                SidebarItems.map((item)=>{
                    const Icon = item.icon;
                    return(
                        <li key={item.path} className="mt-4">
                            <NavLink to={item.path}
                            className="flex items-center gap-3 rounded-lg hover:bg-[var(--hoover)] hover:text-[var(--secondary)] w-full h-8 ">
                                <Icon size={20}/> <span>{item.title}</span>
                            </NavLink>
                        </li>
                    );
                })
                }  </ul>
        </aside>
     );
}

export default Sidebar;