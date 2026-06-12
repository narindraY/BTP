import { Route, Routes } from "react-router-dom";
import Client from "../Client";
import Google from "../Pages/Auth/Google";
import Register from "../Pages/Auth/Register";
import Login from "../Pages/Auth/Login";
import AddPublication from "../Pages/Publication/AddPublication";
import ListPublication from "../Pages/Publication/ListPublication";
import Layout from "../Components/Layout"
import Test from "../test";
import Budget from "../Pages/Finance/Budget";
function Router() {
    return (  
        <Routes>
            <Route path="/" element={<Client/>} />
            <Route path="/google" element={<Google/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/login" element={<Login/>} ></Route>
            <Route element={<Layout/>} >
            <Route path="/publication/create" element={<AddPublication/>} ></Route>
            <Route path="/publication/list" element={<ListPublication/>} ></Route>
            <Route path="/finance" element={<Budget/>} ></Route>
            <Route path="/user" element={<Test/>} ></Route>          
            </Route>
        </Routes>
    );        
}

export default Router;
//<Route path="/finance" element={<Budget/>} ></Route>