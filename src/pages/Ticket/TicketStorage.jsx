import React from "react";

const Ticket = ({ ticket }) => {
  return (
    <div className="bg-white rounded-lg shadow-md flex mb-4">
      <div className="flex-1 p-4">
        <div className="text-red-500 font-bold text-lg">{ticket.cinema}</div>
        <div className="mt-2">
          <div className="text-gray-500 text-sm">PHIM</div>
          <div className="font-bold">{ticket.movie}</div>
        </div>
        <div className="mt-2">
          <div className="text-gray-500 text-sm">ĐỊA CHỈ</div>
          <div className="font-bold">{ticket.address}</div>
        </div>
        <div className="mt-2 flex justify-between">
          <div>
            <div className="text-gray-500 text-sm">PHÒNG</div>
            <div className="font-bold">{ticket.room}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">GHẾ</div>
            <div className="font-bold">{ticket.seat}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">NGÀY</div>
            <div className="font-bold">{ticket.date}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">GIỜ</div>
            <div className="font-bold">{ticket.time}</div>
          </div>
        </div>
      </div>
      <div className="w-24 bg-red-500 text-white flex flex-col items-center justify-center p-4">
        <div className="text-2xl font-bold">{ticket.seat}</div>
        <div className="text-sm">GHẾ</div>
        <img
          alt={`QR code for seat ${ticket.seat}`}
          className="mt-2"
          height="50"
          src={ticket.qrCodeUrl}
          width="50"
        />
      </div>
    </div>
  );
};

const TicketList = ({ tickets }) => {
  return (
    <div className="p-4">
      {tickets.map((ticket, index) => (
        <Ticket key={index} ticket={ticket} />
      ))}
    </div>
  );
};

const ticketsData = [
  {
    cinema: "Cinema Indochina Plaza Hà Nội",
    movie: "X-MEN: PHƯỢNG HOÀNG BÓNG TỐI",
    address: "INDOCHINA PLAZA HÀ NỘI",
    room: "ID-2D-1",
    seat: "E9",
    date: "12/06/2019",
    time: "10:27",
    qrCodeUrl: "https://storage.googleapis.com/a1aa/image/zf0jYXa8fRiYmTFH6jro5nPfngvt4L8-kbR6abqEsY0.jpg",
  },
  // Thêm nhiều vé khác nếu cần
];

const App = () => {
  return <TicketList tickets={ticketsData} />;
};

export default App;
