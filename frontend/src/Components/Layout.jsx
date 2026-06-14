import Sidebar from "./Sidebar";
import Head from "./Head"
import { Outlet } from "react-router-dom";
function Layout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Head />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;