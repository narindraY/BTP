import React, { useEffect, useState } from "react";
import "../../App.css";

import {
  getContrats,
  deleteContrat
} from "../../services/api";

import { useNavigate } from "react-router-dom";

import ContratTable from "./ContratTable";
import ContratActions from "./ContratActions";
import Dialog from "../ui/Dialog"


export default function ContratList() {


  const navigate = useNavigate();


  const [contrats,setContrats] = useState([]);

  const [search,setSearch] = useState("");


  const [openDialog,setOpenDialog] = useState(false);


  const [contratToDelete,setContratToDelete] = useState(null);


  const [message,setMessage] = useState("");



  const fetchContrats = async()=>{

    try{

      const res = await getContrats();

      setContrats(res.data);


    }catch(err){

      console.error(err);

    }

  };



  useEffect(()=>{

    fetchContrats();

  },[search]);




  // ouverture du dialog

  const handleClickDelete = (contrat)=>{

    setContratToDelete(contrat);

    setOpenDialog(true);

  };




  // confirmation

  const handleDelete = async()=>{


    try{


      await deleteContrat(
        contratToDelete.id_contrat
      );


      fetchContrats();


      setMessage(
        "Contrat supprimé avec succès"
      );


      setOpenDialog(false);

      setContratToDelete(null);



    }catch(err){


      setMessage(
        "Vous ne pouvez pas supprimer ce contrat"
      );


      setOpenDialog(false);

      console.error(err);

    }

  };




  return (

    <div className="page-container">


      <h2>
        Liste des Contrats
      </h2>


      <p>
        Gérez tous vos contrats de construction
      </p>


      <p className="text-red-500">
        {message}
      </p>



      <ContratActions

        onAdd={()=>
          navigate("/Contrats/add")
        }

        onSearch={setSearch}

      />




      <ContratTable

        contrats={contrats}

        onDelete={handleClickDelete}

      />
      <Dialog

        isOpen={openDialog}

        title="Supprimer le contrat"

        message={
          `Voulez-vous supprimer le contrat CT-${contratToDelete?.id_contrat} ?`
        }


        onConfirm={handleDelete}


        onCancel={()=>{

          setOpenDialog(false);

          setContratToDelete(null);

        }}

      />


    </div>

  );

}