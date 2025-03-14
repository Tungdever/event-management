import { useState } from "react";

const chats = [
  {
    id: 1,
    name: "Anthony Lewis",
    message: "is typing...",
    time: "02:40 PM",
    img: "https://storage.googleapis.com/a1aa/image/6xubDJj-hzMpppc8Zn-hVCaJLasiHjfwnoCrTpXI0Jw.jpg",
    status: "Online",
    conversation: [
      { sender: "Anthony Lewis", text: "Hi John, I wanted to update you on a new company policy regarding remote work.", time: "08:00 AM" },
      { sender: "Anthony Lewis", text: "Do you have a moment?", time: "08:00 AM" },
      { sender: "You", text: "Sure, Sarah. What’s the new policy?", time: "08:00 AM" }
    ]
  },
  {
    id: 2,
    name: "Elliot Murray",
    message: "Document",
    time: "06:12 AM",
    img: "https://storage.googleapis.com/a1aa/image/Jjz8x9rNWMTHsrCD7jWoUSPc89ax5d78ik4iO0dqnCI.jpg",
    status: "Offline",
    conversation: [
      { sender: "Elliot Murray", text: "Here is the document you asked for.", time: "07:30 AM" }
    ]
  },

];

const ChatBox =()=> {
  const [selectedChat, setSelectedChat] = useState(chats[0]);

  return (
<div className="flex-1 flex overflow-hidden bg-gray-100 p-4 rounded-lg shadow-lg h-[92%]">
  {/* Chat List */}
  <div className="w-1/3 bg-white p-4 overflow-y-auto rounded-lg shadow-md max-h-full">
    <h2 className="text-xl font-bold mb-4">Chat</h2>
    <input
      className="border rounded-full py-2 px-4 w-full mb-4"
      placeholder="Search For Contacts or Messages"
      type="text"
    />
    <h3 className="text-lg font-semibold mb-2">All Chats</h3>
    <div className="space-y-4">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`flex items-center justify-between p-2 border rounded-lg cursor-pointer transition hover:bg-gray-200 ${
            selectedChat.id === chat.id ? "bg-gray-300" : ""
          }`}
          onClick={() => setSelectedChat(chat)}
        >
          <div className="flex items-center">
            <img
              alt={`${chat.name} profile picture`}
              className="rounded-full mr-2"
              height="40"
              src={chat.img}
              width="40"
            />
            <div>
              <h4 className="font-semibold">{chat.name}</h4>
              <p className="text-sm text-gray-500">{chat.message}</p>
            </div>
          </div>
          <span className="text-sm text-gray-500">{chat.time}</span>
        </div>
      ))}
    </div>
  </div>

  {/* Chat Window */}
  <div className="flex-1 bg-white p-4 flex flex-col rounded-lg shadow-md ml-4 max-h-full">
    <div className="flex bg-[#74CEF7] items-center mb-4 p-2 rounded-lg">
      <img
        alt={`${selectedChat.name} profile picture`}
        className="rounded-full mr-2"
        height="40"
        src={selectedChat.img}
        width="40"
      />
      <div>
        <h4 className="font-semibold">{selectedChat.name}</h4>
        <p className="text-sm text-green-500">{selectedChat.status}</p>
      </div>
    </div>

    {/* Chat messages với scroll */}
    <div className="flex-1 overflow-y-auto max-h-full">
      <div className="space-y-4">
        {selectedChat.conversation.map((msg, index) => (
          <div
            key={index}
            className={`flex items-${msg.sender === "You" ? "end justify-end" : "start"}`}
          >
            {msg.sender !== "You" && (
              <img
                alt={`${selectedChat.name} profile picture`}
                className="rounded-full mr-2"
                height="40"
                src={selectedChat.img}
                width="40"
              />
            )}
            <div>
              <p className="bg-gray-100 p-2 rounded-lg mr-2">{msg.text}</p>
              <span className="text-sm text-gray-500">
                {msg.sender} {msg.time}
              </span>
            </div>
            
          </div>
        ))}
      </div>
    </div>

    {/* Input chat */}
    <div className="mt-4 flex items-center">
      <input
        className="border rounded-full py-2 px-4 flex-1"
        placeholder="Type Your Message"
        type="text"
      />
      <button className="ml-2 bg-orange-500 text-white p-2 rounded-full">
        <i className="fas fa-paper-plane"></i>
      </button>
    </div>
  </div>
</div>

  );
}
export default ChatBox