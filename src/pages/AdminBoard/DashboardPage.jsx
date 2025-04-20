import React from 'react';
 



const UserList = () => {

  // User data
  const users = [
    {
      id: 1,
      name: 'Wade Warren',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      skills: ['Marketing Liaison', 'Coordinator ?'],
    },
    {
      id: 2,
      name: 'Loura Weber',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      skills: ['Lead Manager', 'Confidence'],
    },
    {
      id: 3,
      name: 'Jane Cooper',
      avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
      skills: ['Dog Trainer', 'Trainer'],
    },
   
  ];

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-[4px] shadow flex flex-col py-4 border border-gray-200">
        {users.map((user) => (
          <div
            key={user.id}
            className="user-row flex flex-col items-center justify-between cursor-pointer p-4 duration-300 sm:flex-row sm:py-4 sm:px-8 hover:bg-[#f6f8f9] dark:hover:bg-gray-700"
          >
            <div className="user flex items-center text-center flex-col sm:flex-row sm:text-left">
              <div className="avatar-content mb-2.5 sm:mb-0 sm:mr-2.5">
                <img
                  className="avatar w-10 h-10 rounded-full"
                  src={user.avatar}
                  alt={`${user.name}'s avatar`}
                />
              </div>
              <div className="user-body flex flex-col mb-4 sm:mb-0 sm:mr-4 text-[12px]">
                <a href="#" className="title font-medium no-underline text-gray-800 dark:text-white">
                  {user.name}
                </a>
                <div className="skills flex flex-col">
                  {user.skills.map((skill, index) => (
                    <span key={index} className="subtitle text-slate-500 dark:text-slate-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
          </div>
        ))}
        <a
          href="#/"
          className="show-more block w-10/12 mx-auto py-2.5 px-4 text-center no-underline rounded hover:bg-[#f6f8f9] font-medium duration-300 text-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          Show more members
        </a>
      </div>
  );
};

const DashboardPage = () => {
    const stats = [
      { title: 'Total Events', value: '150', icon: 'fas fa-calendar-alt', color: '#a5d8ff', change: '+3.4%' },
      { title: 'Active Accounts', value: '320', icon: 'fas fa-users', color: '#a7f3d0', change: '-2.8%' },
      { title: 'Total Sales', value: '$12,500', icon: 'fas fa-dollar-sign', color: '#fed7aa', change: '+4.6%' },
      { title: 'Total Orders', value: '780', icon: 'fas fa-shopping-cart', color: '#d8b4fe', change: '-1.1%' },
    ];
  
    const events = [
      { id: 1, name: 'Tech Conference', date: '2025-05-20', status: 'Upcoming' },
      { id: 2, name: 'Music Festival', date: '2025-06-15', status: 'Active' },
    ];
  
    return (
      <section className="space-y-6 overflow-y-auto">
        <div className="bg-white rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-bold text-sm text-[#1e1e2d] select-none">Overview</h1>
            <button
              aria-label="Select monthly"
              className="text-xs bg-gray-200 text-gray-700 rounded-full px-3 py-1 flex items-center gap-1 hover:bg-gray-300"
            >
              Monthly
              <i className="fas fa-chevron-down text-[10px]"></i>
            </button>
          </div>
          <div className="flex space-x-4 mb-6 max-w-full overflow-x-auto gap-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="bg-[#f9fafb] rounded-xl p-4 w-28 min-w-[260px] flex flex-col items-center text-center"
              >
                <div className={`rounded-full p-2 mb-2`} style={{ backgroundColor: stat.color }}>
                  <i className={`${stat.icon} text-[#1e293b]`}></i>
                </div>
                <p className="text-[10px] text-gray-600 mb-1 select-none">{stat.title}</p>
                <p className="font-bold text-sm text-[#1e1e2d] mb-1">{stat.value}</p>
                <p
                  className={`text-xs font-semibold select-none ${
                    stat.change.startsWith('+') ? 'text-[#22c55e]' : 'text-[#f87171]'
                  }`}
                >
                  {stat.change}
                  <span className="font-normal text-gray-500"> from last month</span>
                </p>
              </div>
            ))}
          </div>
            <h1 className="font-bold text-sm mb-4 select-none">Event List</h1>
          
          <div className="flex overflow-x-auto mt-4 space-x-4">
            <UserList/>
            <table className="w-full text-left text-xs text-gray-700 border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-500 font-semibold select-none">
                  <th className="pl-4 py-2">Name</th>
                  <th className="py-2">Date</th>
                  <th className="pr-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="bg-[#f9fafb] rounded-lg">
                    <td className="pl-4 py-3">{event.name}</td>
                    <td className="py-3">{event.date}</td>
                    <td className="pr-4 py-3">{event.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  };

  export default DashboardPage