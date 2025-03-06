import React from "react";

const cards = [
  {
    id: 1,
    name: "Tony Wayne",
    role: "Developer",
    image:
      "https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8&auto=format&fit=crop&w=772&q=80",
  },
  {
    id: 2,
    name: "Emma Stone",
    role: "Designer",
    image:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8&auto=format&fit=crop&w=772&q=80",
  },
  {
    id: 3,
    name: "John Doe",
    role: "Photographer",
    image:
      "https://images.unsplash.com/photo-1522091066250-665186289043?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8&auto=format&fit=crop&w=772&q=80",
  },
  {
    id: 4,
    name: "Alice Brown",
    role: "Marketer",
    image:
      "https://images.unsplash.com/photo-1531251445707-1f000e1e87d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8&auto=format&fit=crop&w=772&q=80",
  },
  {
    id: 5,
    name: "Alice Brown",
    role: "Marketer",
    image:
      "https://images.unsplash.com/photo-1531251445707-1f000e1e87d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8&auto=format&fit=crop&w=772&q=80",
  },
];

const SliderSpeaker = () => {
  return (
    <div className="w-full overflow-x-auto my-[40px]">
      <div className="flex gap-6 w-max">
        {cards.map((card) => (
          <a
            key={card.id}
            href="#"
            className="group relative block bg-black w-[300px] flex-shrink-0 rounded-lg overflow-hidden"
          >
            <img
              alt={card.name}
              src={card.image}
              className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
            />
            <div className="relative p-4 sm:p-6 lg:p-8">
              <p className="text-sm font-medium uppercase tracking-widest text-pink-500">
                {card.role}
              </p>
              <p className="text-xl font-bold text-white sm:text-2xl">{card.name}</p>
              <div className="mt-32 sm:mt-48 lg:mt-64">
                <div className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-sm text-white">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis perferendis hic asperiores.
                  </p>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SliderSpeaker;
