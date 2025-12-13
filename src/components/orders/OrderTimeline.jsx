const steps = ["Pending", "Packed", "Shipped", "Delivered"];

const OrderTimeline = ({ order, onClose }) => {
  const currentStep = steps.indexOf(order.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-96">
        <h3 className="text-xl font-bold mb-4">Order Tracking</h3>
        <ul className="space-y-3">
          {steps.map((step, index) => (
            <li
              key={step}
              className={`p-2 rounded ${index <= currentStep ? "bg-green-500 text-white" : "bg-gray-200"}`}
            >
              {step}
            </li>
          ))}
        </ul>
        <button className="mt-5 px-4 py-2 bg-gray-600 text-white rounded" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderTimeline;
