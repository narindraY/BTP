import Sidebar from "./Sidebar";
import Head from "./Head"
import { Outlet } from "react-router-dom";
function Layout() {
    return ( 
        <div className="h-screen overflow-hidden">
            <Head/>   
        <div className="flex h-4 ">
            <Sidebar/>
        <main className="flex-1 p-6">
            <Outlet/>
        </main>
        </div>
        </div>
     );
}

export default Layout;