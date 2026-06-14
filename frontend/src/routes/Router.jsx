import {AnimatePresence} from "framer-motion"
import { Route, Routes, useLocation } from "react-router-dom";

import Google from "../Pages/Auth/Google";
import Register from "../Pages/Auth/Register";
import Login from "../Pages/Auth/Login";
import AddPublication from "../Pages/Publication/AddPublication";
import ListPublication from "../Pages/Publication/ListPublication";
import Layout from "../Components/Layout"
import Test from "../Test";
import Budget from "../Pages/Finance/Budget";
import Client from "../Pages/Home/Client";
import List from "../Pages/Home/List";
import About from "../Pages/Home/About";
import Contact from "../Pages/Home/Contact";
import bg from "../assets/bg.png"
import LayoutUser from "../Components/LayoutUser";
import Chat from "../Pages/Chat/Chat";
function Router() {
    const location = useLocation();
    return (  
       <>
        <Routes>
            <Route path="/google" element={<Google/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/login" element={<Login/>} ></Route>
            <Route element={<Layout/>} >
            <Route path="/publication/create" element={<AddPublication/>} ></Route>
            <Route path="/publication/list" element={<ListPublication/>} ></Route>
            <Route path="/finance" element={<Budget/>} ></Route>
            <Route path="/chat" element={<Chat/>} ></Route>
            </Route>
          
        <Route element={<LayoutUser/>}>

            <Route path="/user" element={<Test/>} ></Route>        
        </Route>
        </Routes>
          
           <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
            <Route  style={{ background: `url(${bg})` }} >
            <Route path="/" element={<Client/>} />
            <Route path="/user/publication" element={<List/>} > </Route>
            <Route path="/about" element={<About/>} ></Route>
            <Route path="/contact" element={<Contact/>} ></Route>
            </Route>
           
            </Routes>
           </AnimatePresence>
       </>
    );        
}

export default Router;
//<Route path="/finance" element={<Budget/>} ></Route>