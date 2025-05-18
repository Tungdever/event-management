import { useState, useEffect } from "react";
import { useAuth } from "../pages/Auth/AuthProvider";

const FavoriteButton = ({ eventId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  // Lấy danh sách sự kiện yêu thích
  const getFavorites = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/favorites/${user.userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch favorite events");
      }
      const data = await response.json();
      const favoriteEventIds = new Set(data.map(event => event.eventId));
      setIsFavorite(favoriteEventIds.has(eventId));
    } catch (error) {
      console.error("Error fetching favorite events:", error);
    }
  };

  // Thêm sự kiện vào danh sách yêu thích
  const addFavorite = async () => {
    try {
      const favoriteEvent = { userId: user.userId, eventId };
      const response = await fetch("http://localhost:8080/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(favoriteEvent),
      });
      if (!response.ok) {
        throw new Error("Failed to add favorite event");
      }
      setIsFavorite(true);
    } catch (error) {
      console.error("Error adding favorite event:", error);
    }
  };

  // Xóa sự kiện khỏi danh sách yêu thích
  const removeFavorite = async () => {
    try {
      const favoriteEvent = { userId: user.userId, eventId };
      const response = await fetch("http://localhost:8080/api/favorites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(favoriteEvent),
      });
      if (!response.ok) {
        throw new Error("Failed to remove favorite event");
      }
      setIsFavorite(false);
    } catch (error) {
      console.error("Error removing favorite event:", error);
    }
  };

  // Chuyển đổi trạng thái yêu thích
  const toggleFavorite = (e) => {
    e.stopPropagation(); // Ngăn sự kiện click lan tỏa
    if (isFavorite) {
      removeFavorite();
    } else {
      addFavorite();
    }
  };

  // Lấy danh sách yêu thích khi component được mount
  useEffect(() => {
    if (user) {
      getFavorites();
    }
  }, [user, eventId]);

  return (
    <i
      className={`fa-heart text-white absolute bottom-2 right-2 text-[24px] p-2 rounded-full cursor-pointer ${
        isFavorite ? "fa-solid bg-red-500" : "fa-regular hover:bg-red-500"
      }`}
      onClick={toggleFavorite}
    ></i>
  );
};

export default FavoriteButton;