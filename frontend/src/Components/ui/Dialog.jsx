function Dialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center">
      
      <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
        
        <h2 className="text-xl font-bold mb-2 text-[var(--primary)] ">{title}</h2>
        <p className="mb-4 text-[var(--primary)] ">{message}</p>

        <div className="flex justify-end gap-2">
          
          <button onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded">
            Annuler
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Confirmer
          </button>

        </div>

      </div>
    </div>
  );
}
export default Dialog;