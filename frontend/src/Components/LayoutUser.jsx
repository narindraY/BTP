import { Outlet } from "react-router-dom";
import Head from "./Head";
import SideUser from "./SideUser";

function LayoutUser() {
    return ( 
            <div className="h-screen overflow-hidden">
            <Head/>   
        <div className="flex h-4 ">
            <SideUser/>
        <main className="flex-1 p-6">
            <Outlet/>
        </main>
        </div>
        </div>
     );
}

export default LayoutUser;