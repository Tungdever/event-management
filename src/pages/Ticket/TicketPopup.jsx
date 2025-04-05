const TicketPopup = ({ isOpen, onClose, onSelectType }) => {
    if (!isOpen) return null;
  
    return (
      <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg p-4 w-64">
        <button
          onClick={onClose}
          className="absolute text-gray-500 text-sm mb-2 right-2"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div className="space-y-4">
          {[
            { icon: "ticket-alt", color: "blue", label: "Paid" },
            { icon: "scissors", color: "purple", label: "Free" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => onSelectType(item.label)}
            >
              <div className={`bg-${item.color}-100 p-2 rounded-lg`}>
                <i className={`fas fa-${item.icon} text-${item.color}-600`}></i>
              </div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default TicketPopup