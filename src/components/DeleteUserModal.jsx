// eslint-disable-next-line react/prop-types
export default function DeleteUserModal({ open, onClose, children }) {
  return (
    // <div className="modal">
    //   <div className="modal-content">
    //     <h2>Confirm Deletion</h2>
    //     <p>Are you sure you want to delete this item?</p>
    //     <div className="modal-buttons">
    //       <button onClick={onDelete}>Delete</button>
    //       <button onClick={onCancel}>Cancel</button>
    //     </div>
    //   </div>
    // </div>
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-colors ${
        open ? "visible bg-black/20" : "invisible"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-xl shadow p-6 transition-all ${
          open ? "scale-100 opacity-100" : "scale-125 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-lg text-gray-100 bg-white hover:bg-gray-50 hover:text-gray-600"
        ></button>
        {children}
      </div>
    </div>
  );
}
