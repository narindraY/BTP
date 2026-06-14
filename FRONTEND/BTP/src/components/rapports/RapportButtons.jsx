import React from "react";
import api from "../../services/api";
import "../../App.css";

export default function RapportButtons() {

  const generateRapport = async (type) => {

    let url = "";

    switch (type) {

      case "journalier":
        url = "/rapports/journalier/pdf";
        break;

      case "mensuel":
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        url = `/rapports/mensuel/pdf?month=${month}&year=${year}`;
        break;

      case "financier":
        url = "/rapports/financier/pdf";
        break;

      default:
        return;
    }

    try {

      const response = await api.get(url, {
        responseType: "blob"
      });

      const pdfBlob = new Blob(
        [response.data],
        { type: "application/pdf" }
      );

      const pdfUrl = window.URL.createObjectURL(pdfBlob);

     
      window.open(pdfUrl, "_blank");

    } catch (error) {

      console.error(
        "Erreur génération rapport :",
        error
      );

      alert(
        "Erreur lors de la génération du rapport ❌"
      );
    }
  };

  return (
    <div
      className="rapport-buttons"
      style={{
        display: "flex",
        gap: "10px",
        marginTop: "20px"
      }}
    >

      <button
        className="btn-primary"
        onClick={() =>
          generateRapport("journalier")
        }
      >
        📄 Rapport Journalier
      </button>

      <button
        className="btn-primary"
        onClick={() =>
          generateRapport("mensuel")
        }
      >
        📅 Rapport Mensuel
      </button>

      <button
        className="btn-primary"
        onClick={() =>
          generateRapport("financier")
        }
      >
        💰 Rapport Financier
      </button>

    </div>
  );
}