import React from 'react';
import { List, ListItem, ListItemText, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '../CartContext';

const Cart = ({ }) => {

//this component is redacted but left here for possible future use

  const { cartItems, updateQuantity, removeFromCart } = useCart();


  const updatedCartItems = cartItems.reduce((acc, currentItem) => {
    const existingItem = acc.find((item) => item.id === currentItem.id);

    if (existingItem) {
      existingItem.quantity += currentItem.quantity;
    } else {
      acc.push({ ...currentItem });
    }
    return acc;
  }, []);

  const handleQuantityUpdate = (item, newQuantity) => {
    
    updateQuantity(item, newQuantity);

  };

  const removeItemFromCart = (item) => {
    
    removeFromCart(item);

  };


  const totalPrice = updatedCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div>
      <Typography variant="h5">Your Cart</Typography>
      {updatedCartItems.length === 0 ? (
        <Typography variant="body1">Your cart is empty.</Typography>
      ) : (
        <List>
          {updatedCartItems.map((item, index) => (
            <ListItem key={index}>
              <ListItemText>
                <Typography variant="subtitle1">{item.name}</Typography>
                <Typography variant="caption">Price: ${item.price.toFixed(2)} each</Typography>
                <Typography variant="body2">
                  Total: ${(item.price * item.quantity).toFixed(2)} (Quantity: {item.quantity})
                </Typography>
                <Button style={{ color: '#fff' }}  onClick={() => removeItemFromCart(item)}>Remove</Button>
                <Button style={{ color: '#fff' }} onClick={() => handleQuantityUpdate(item, item.quantity + 1)}>
                  <AddIcon />
                </Button>
                <Button style={{ color: '#fff' }}  onClick={() => handleQuantityUpdate(item, Math.max(item.quantity - 1, 1))}>
                  <RemoveIcon />
                </Button>
              </ListItemText>
            </ListItem>
          ))}
          <Typography variant="body1">Total Price: ${totalPrice.toFixed(2)}</Typography>
        </List>
      )}
    </div>
  );
};

export default Cart;
