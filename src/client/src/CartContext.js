import React, { createContext, useContext, useState, useEffect } from 'react';
import { createCartFromLocal, switchCart } from "./api/Api";
import { addToCart as addToCartCall, updatedCartItemsQuantity, removeCart, createUserOrder } from "./api/Api";

const CartContext = createContext([]);

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(0);
  const [user, setUser] = useState({ name: "", surname: "", isAdmin: "", email: "" });



  
  // Function to add a product to the cart
  

  useEffect(() => {
      const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
      const maybeCartId = JSON.parse(localStorage.getItem("cartId"));
      const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

      setUser(userFromLocalStorage);
      setCartItems(storedCartItems);

      if (!maybeCartId) {
        setCartId(0);

        if (userFromLocalStorage && storedCartItems.length > 0) {
          createCartFromLocal(storedCartItems, userFromLocalStorage.id).then((response) => {
            console.log(response);
            setCartItems(response.data.cartItemss);
            setCartId(response.data.cartId);
            localStorage.removeItem("cartItems");
            localStorage.setItem('cartId', JSON.stringify({ id: response.data.cartId }));

          });
        }
      } else {
        switchCarts(maybeCartId.id);
      }
    


  }, []);


  const switchCarts = (cartId) => {
    switchCart(cartId).then((response) => {
      setCartItems(response.data.cartItems);
      setCartId(response.data.cartId);
      localStorage.setItem('cartId', JSON.stringify({id:cartId}));

    });
  };

  const updateQuantity = (itemToUpdate, newQuantity) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const cartId = JSON.parse(localStorage.getItem('cartId'));
      if (user && cartId) {
        // If the user is logged in, update the cart items in the database
        updatedCartItemsQuantity(itemToUpdate, cartId, newQuantity)
          .then((response) => {
            const updatedItems = cartItems.map((item) => {
              if (item.id === itemToUpdate.id) {
                // Ensure the new quantity is a valid number
                const quantity = parseInt(newQuantity);
                return { ...item, quantity: isNaN(quantity) ? 0 : quantity };
              }
              return item;
            });
            setCartItems(updatedItems);
          })
          .catch((error) => {
            console.error('Error updating cart items in the database:', error);
          });
      } else {
        // If the user is not logged in, update the local state with the new item quantity
        const updatedItems = cartItems.map((item) => {
          if (item.id === itemToUpdate.id) {
            // Ensure the new quantity is a valid number
            const quantity = parseInt(newQuantity);
            return { ...item, quantity: isNaN(quantity) ? 0 : quantity };
          }
          return item;
        });
        setCartItems(updatedItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedItems)); // Update local storage
      }
    } catch (error) {
      console.error('Error updating carts:', error);
    }
  };



  const addToCart = (product) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      let cartId = JSON.parse(localStorage.getItem("cartId"));
      if (!cartId){
        cartId = {id: 0}; // Assigning a new value to a variable declared with let
      }

      if (user) {
        const userId = user.id;
        if (cartId) {
          // Check if the product already exists in the cart
          const existingItem = cartItems.find((item) => item.id === product.id);
  
          if (existingItem) {
            // If the product exists in the cart, update its quantity
            const newQuantity = existingItem.quantity + 1;
            updateQuantity(existingItem, newQuantity);
          } else {
            // If the product doesn't exist in the cart, add it as a new item
            const quantity = parseInt(product.quantity);
            const newItem = { ...product, quantity: isNaN(quantity) ? 1 : quantity };
        addToCartCall(userId, newItem, cartId)
          .then((response) => {
            setCartItems(response.data.cartItems);
            setCartId(response.data.cartId);
            localStorage.setItem('cartId', JSON.stringify({ id: response.data.cartId }));
          })
          .catch((error) => {
            console.error('Error adding item to cart:', error);
          });
          }
        }
      } else {
      const existingItem = cartItems.find((item) => item.id === product.id);

      if (existingItem) {
        // If the product exists in the local cart, update its quantity
        const newQuantity = existingItem.quantity +  1;
        updateQuantity(existingItem, newQuantity);
      } else {
        // If the product doesn't exist in the local cart, add it as a new item
        const quantity = parseInt(product.quantity);
        const newItem = { ...product, quantity: isNaN(quantity) ? 1 : quantity };

        const updatedCartItems = [...cartItems, newItem];
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        setCartItems(updatedCartItems);
      }
      }
    } catch (error) {
      console.error('Error fetching user carts:', error);
    }
  };

  const createOrder = (cartIds, userId) => {
    createUserOrder( cartIds, userId ).then((response) => {
    });

    localStorage.setItem('cartId', 0);
    setCartItems([]);
    localStorage.removeItem("cartItems");

  };

  const removeFromCart = (itemToRemove) => {
    try{
      let cartId = JSON.parse(localStorage.getItem("cartId"));
        updatedCartItemsQuantity( itemToRemove, cartId, 0 ).then((response) => {
          console.log(response);
          if (response.data.delete === true){
            localStorage.setItem('cartId', 0);
            setCartItems([]);
          }
          const updatedCartItems = cartItems.filter(item => item.id !== itemToRemove.id);
          setCartItems(updatedCartItems);
        })
        
        
      } catch (error) {
        
        
      };
  }

  const clearCart = () => {
    localStorage.setItem('cartId', 0);
    setCartItems([]);

    localStorage.removeItem("cartItems");

  };

  const deleteCart = (cartId) => {
console.log("tääl ois");
    if(!cartId){
    cartId = JSON.parse(localStorage.getItem("cartId"));
    }
    console.log(cartId);
    if (cartId){
      removeCart( cartId ).then((response) => {
        clearCart();
      });
    }
  }




  return (
    <CartContext.Provider value={{ cartItems,setCartItems,createOrder, addToCart, user, removeFromCart, updateQuantity, deleteCart, clearCart, switchCarts}}>
      {children}
    </CartContext.Provider>
  );
};
