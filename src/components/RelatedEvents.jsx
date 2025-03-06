import React from "react";

const events = [
  {
    event_id: 2,
    event_desc: "Hội thảo công nghệ AI",
    event_image:
      "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F964039683%2F2118156264673%2F1%2Foriginal.20250219-042855?crop=focalpoint&fit=crop&w=940&auto=format%2Ccompress&q=75&sharp=10&fp-x=0.005&fp-y=0.005&s=834c604b2892887b37d8a14459a1d359",
    event_name: "AI Conference 2025",
    event_start: "2025-04-10T09:00:00",
    price: 500000,
  },
  {
    event_id: 3,
    event_desc: "Giải đấu thể thao điện tử",
    event_image:
      "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F964039683%2F2118156264673%2F1%2Foriginal.20250219-042855?crop=focalpoint&fit=crop&w=940&auto=format%2Ccompress&q=75&sharp=10&fp-x=0.005&fp-y=0.005&s=834c604b2892887b37d8a14459a1d359",
    event_name: "Esports Championship",
    event_start: "2025-05-20T18:00:00",
    price: 300000,
  },
  {
    event_id: 4,
    event_desc: "Lễ hội âm nhạc mùa hè",
    event_image:
      "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F964039683%2F2118156264673%2F1%2Foriginal.20250219-042855?crop=focalpoint&fit=crop&w=940&auto=format%2Ccompress&q=75&sharp=10&fp-x=0.005&fp-y=0.005&s=834c604b2892887b37d8a14459a1d359",
    event_name: "Summer Music Festival",
    event_start: "2025-06-15T16:00:00",
    price: 800000,
  },
  {
    event_id: 55,
    event_desc: "Lễ hội âm nhạc mùa hè",
    event_image:
      "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F964039683%2F2118156264673%2F1%2Foriginal.20250219-042855?crop=focalpoint&fit=crop&w=940&auto=format%2Ccompress&q=75&sharp=10&fp-x=0.005&fp-y=0.005&s=834c604b2892887b37d8a14459a1d359",
    event_name: "Summer Music Festival",
    event_start: "2025-06-15T16:00:00",
    price: 800000,
  },
  {
    event_id: 6,
    event_desc: "Lễ hội âm nhạc mùa hè",
    event_image:
      "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F964039683%2F2118156264673%2F1%2Foriginal.20250219-042855?crop=focalpoint&fit=crop&w=940&auto=format%2Ccompress&q=75&sharp=10&fp-x=0.005&fp-y=0.005&s=834c604b2892887b37d8a14459a1d359",
    event_name: "Summer Music Festival",
    event_start: "2025-06-15T16:00:00",
    price: 800000,
  },
];

const EventCard = ({ event }) => {
  return (
    <div className="relative flex flex-col mt-[40px] mx-auto text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-[300px] h-[320px]">
    <div className="relative w-[260px] h-[260px] mx-auto -mt-4 overflow-hidden text-white shadow-lg bg-clip-border rounded-xl bg-blue-gray-500 shadow-blue-gray-500/40 flex justify-center items-center">
        <img
            src="https://i.pinimg.com/474x/d4/25/b1/d425b16e9e01a5bafd13332af9fcc250.jpg"
            alt="card-image"
            className="w-full h-full object-cover"
        />
    </div>
    <div className="px-6 py-6">
        <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
            UI/UX Review Check
        </h5>
        <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
            The place is close to Barceloneta Beach and bus stop just
        </p>
    </div>
</div>

  );
};

const RelatedEvents = () => {
  return (
    <div className="bg-[#5A82BF] w-full">
    <section className=" p-4 rounded-[6px] w-[95%] ">
      <h2 className="text-xl font-bold mb-4 px-10">Có thể bạn cũng thích</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-8">
        {events.map((event) => (
          <EventCard key={event.event_id} event={event} />
        ))}

      </div>
      <div className="flex justify-center">
        <button className="bg-blue-900 text-white px-4 py-2 mt-4 rounded-md">
          Xem thêm sự kiện
        </button>
      </div>

      
      
    </section>
    </div>



   
  );
};

export default RelatedEvents;
