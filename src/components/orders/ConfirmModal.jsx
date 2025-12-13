const ConfirmModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-amber-300 p-6 rounded">
        <h3 className="text-lg font-bold mb-4">
          Are you sure you want to cancel this order?
        </h3>
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onCancel}>
            No
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={onConfirm}>
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
