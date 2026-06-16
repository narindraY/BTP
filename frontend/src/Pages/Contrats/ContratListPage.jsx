import '../../Styles.css'
import ContratList from "../../Components/contrats/ContratList";

export default function ContratListPage() {
  return (
    <div>
      <h2 className='text-center text-2xl text-[var(--primary)] '>Gestion des contrats</h2>
      <ContratList />
    </div>
  );
}