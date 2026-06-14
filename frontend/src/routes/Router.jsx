import {AnimatePresence} from "framer-motion"
import { Route, Routes, useLocation } from "react-router-dom";

import Google from "../Pages/Auth/Google";
import Register from "../Pages/Auth/Register";
import Login from "../Pages/Auth/Login";
import AddPublication from "../Pages/Publication/AddPublication";
import ListPublication from "../Pages/Publication/ListPublication";
import Layout from "../Components/Layout"
import Test from "../test";
import Budget from "../Pages/Finance/Budget";
import Client from "../Pages/Home/Client";
import List from "../Pages/Home/List";
import About from "../Pages/Home/About";
import Contact from "../Pages/Home/Contact";
import bg from "../assets/bg.png"
import LayoutUser from "../Components/LayoutUser";
//route madio
import Dashboard from "../Pages/Dashboard/Dashboard";
import Contrats from "../Pages/Contrats/Contrats";
//Narindra - Nate
//import 'bootstrap/dist/css/bootstrap.min.css';

    
import Projets from "../Pages/Projets/Projet";
import Ressources from "../Pages/Ressources/Ressources";

import Rapports from "../Pages/Rapports/Rapports";
import Suivi from "../Pages/Suivi/Suivi";
import AddSuiviPage from "../Pages/Suivi/AddSuiviPage";
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
            {/** route madio */}
            <Route path="/dashboard"element={<Dashboard />} />
            <Route path="/contrats/*" element={<Contrats />} />
            <Route path="/projets"      element={<Projets/>} />
             <Route path="/ressources"   element={<Ressources />} />
            
             <Route path="/rapports"     element={<Rapports/>} />
             <Route path="/suivi/*"        element={<Suivi/>} />
             <Route path="/suivis/add" element={<AddSuiviPage/>} ></Route>
             <Route path="/chat" element={<Chat/>} ></Route>
            {/** 
             * 
             */}

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







          {/*
            
            <Route path="/projets"      element={<Projets />} />
           
            <Route path="/contrats"     element={<ComingSoon title="Contrats" />} />
            
            <Route path="/finance"      element={<ComingSoon title="Finance" />} />
            
            <Route path="/utilisateurs" element={<ComingSoon title="Utilisateurs" />} />
            <Route path="/parametres"   element={<ComingSoon title="Paramètres" />} />
            <Route path="*"             element={<ComingSoon title="Page non trouvée" />} />
            */}
        