import React from "react";
import "../../App.css";

export default function ContratTable({ contrats, onView, onEdit, onDelete }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Référence</th>
          <th>Client</th>
          <th>Type</th>
          <th>Budget</th>
          <th>Date début</th>
          <th>Date fin</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {contrats.map((c) => (
          <tr key={c.id_contrat}>
            <td>CT-{c.id_contrat}</td>
            <td>{c.client}</td>
            <td>{c.type_contrat}</td>
            <td>{c.budget} FCFA</td>
            <td>{c.date_debut}</td>
            <td>{c.date_fin}</td>
            <td>{c.description}</td>
            <td>
              <button className="btn-action btn-view" onClick={() => onView(c)}>👁</button>
              <button className="btn-action btn-edit" onClick={() => onEdit(c)}>✏</button>
              <button className="btn-action btn-delete" onClick={() => onDelete(c.id_contrat)}>🗑</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
