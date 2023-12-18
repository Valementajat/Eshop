import { getUserCarts } from "../api/Api";
import CartsList from "../components/CartsList";
import React, { useEffect, useState } from "react";

const Cart = () => {
  const [carts, setCarts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      window.location.replace("/");
      return;
    }
    const fetchUserCarts = async () => {
      try {
        const response = await getUserCarts({ userId: user.id });
        setCarts(response.data.carts);
      } catch (error) {
        console.error("Error fetching user carts:", error);
      }
    };

    fetchUserCarts();
  }, [user.id]);

  return (
    <div>
      <h2>List of Carts</h2>
      <CartsList carts={carts} />
    </div>
  );
};

export default Cart;
