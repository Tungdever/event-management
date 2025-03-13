const NotificationList =({notifications})=> {
  return (
    <div className="mx-[8px] min-h-[800px] p-4  overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[28px] font-bold">Thông báo</h1>
        <i className="fas fa-ellipsis-h text-gray-400"></i>
      </div>
      <div className="flex space-x-4 mb-4">
        <button className="px-4 py-2 bg-gray-100 rounded-lg text-[14px]">Tất cả</button>
        <button className="px-4 py-2 bg-gray-100 rounded-lg text-[14px]">Chưa đọc</button>
      </div>
      <h2 className="text-[14px] font-semibold mb-4 ">Trước đó</h2>
      <div className="space-y-4 ">
        {notifications.map((notif) => (
          <div key={notif.id} className="flex items-start space-x-4  py-4 px-2">
            <img src={notif.image} alt={notif.name} className="w-12 h-12 rounded-full" />
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-bold">{notif.name}</span> {notif.message}
              </p>
              <p className="text-xs text-gray-400">{notif.time}</p>
              {notif.mutualFriends && <p className="text-xs text-gray-400">{notif.mutualFriends}</p>}
              {notif.hasActions && (
                <div className="flex space-x-2 mt-2">
                  <button className="px-4 py-1 bg-blue-600 rounded-lg text-white text-[12px]">Xác nhận</button>
                  <button className="px-4 py-1 bg-gray-600 rounded-lg text-white text-[12px]">Xóa</button>
                </div>
              )}
            </div>
            <i className="fas fa-circle text-blue-500 text-xs"></i>
          </div>
        ))}
      </div>
    </div>
  );
}
export default NotificationList