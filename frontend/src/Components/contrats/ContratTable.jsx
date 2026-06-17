import { FiTrash2 } from "react-icons/fi";


const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("fr-FR") : "—";


const fmtBudget = (b) =>
  `${Number(b || 0).toLocaleString("fr-FR")} FCFA`;


const COLS = [
  "Référence",
  "Client",
  "Type",
  "Budget",
  "Date début",
  "Date fin",
  "Description",
  "Actions"
];


export default function ContratTable({
  contratos,
  contrats,
  onDelete
}) {

  const data = contratos || contrats || [];


  return (
    <div
      className="w-full overflow-x-auto rounded-xl"
      style={{
        border:"0.5px solid rgba(6,11,39,0.1)"
      }}
    >

      <table className="w-full text-[13px] border-collapse">


        <thead>

          <tr
            style={{
              borderBottom:"0.5px solid rgba(6,11,39,0.08)",
              background:"rgba(6,11,39,0.02)"
            }}
          >

            {COLS.map(col => (
              <th
                key={col}
                className="text-left px-4 py-3 text-[11px] font-semibold uppercase"
              >
                {col}
              </th>
            ))}

          </tr>

        </thead>


        <tbody>

          {data.map((c,i)=>(

            <tr
              key={c.id_contrat}
              style={{
                borderBottom:
                i < data.length-1
                ? "0.5px solid rgba(6,11,39,0.06)"
                : "none"
              }}
            >


              <td className="px-4 py-3 font-semibold">
                CT-{c.id_contrat}
              </td>


              <td className="px-4 py-3">
                {c.client}
              </td>


              <td className="px-4 py-3">
                {c.type_contrat}
              </td>


              <td className="px-4 py-3">
                {fmtBudget(c.budget)}
              </td>


              <td className="px-4 py-3">
                {fmtDate(c.date_debut)}
              </td>


              <td className="px-4 py-3">
                {fmtDate(c.date_fin)}
              </td>


              <td className="px-4 py-3 max-w-[180px]">
                <span className="truncate block">
                  {c.description || "—"}
                </span>
              </td>


              <td className="px-4 py-3">

                <button
                  onClick={()=>onDelete(c)}
                  className="
                    px-4 py-2 rounded
                    bg-red-500 text-white
                    flex items-center gap-2
                  "
                >

                  <FiTrash2/>

                  Supprimer

                </button>

              </td>


            </tr>

          ))}

        </tbody>


      </table>

    </div>
  );
}