import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import HomeIcon from '@mui/icons-material/Home';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { useCart } from '../CartContext'; // Import useCart hook
import Badge from '@mui/material/Badge';


const ToolbarComponent = () => {
  const [user, setUser] = useState({ name: "", surname: "", isAdmin: "", email: "" });
  const [cartId, setCartId] = useState('');
  const [anchorEl, setAnchorEl] = useState(null); // For Menu anchor
  const [userAnchorEl, setUserAnchorEl] = useState(null); // For User Menu anchor
  const navigate = useNavigate();


  const { cartItems, deleteCart, clearCart, removeFromCart, updateQuantity } = useCart();
  const itemsCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => {
      const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
      setUser(userFromLocalStorage);

      const storedCartId = JSON.parse(localStorage.getItem('cartId'));
    if (storedCartId) {
      setCartId(storedCartId.id);
    }
  }, []);

   

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cartId");
    localStorage.removeItem("cartItems");
    window.location.replace("/");
  };

/*   const handleCartClick = () => {
    const storedCartId = JSON.parse(localStorage.getItem('cartId'));
    const cartId = storedCartId ? storedCartId.id : '';
    window.location.href = `/cart:${cartId}`;
  }; */

  const handleCartClick = (event) => {
    setAnchorEl(event.currentTarget); // Set the anchor for the menu
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const handleUserIconClick = (event) => {
    setUserAnchorEl(event.currentTarget); // Set the anchor for the user icon menu
  };

  const handleUserMenuClose = () => {
    setUserAnchorEl(null); // Close the user icon menu
  };
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleQuantityUpdate = (item, newQuantity) => {
    
    updateQuantity(item, newQuantity);

  };

  const removeItemFromCart = (item) => {

      removeFromCart(item);
    console.log(`Removing item ${item.id} from the cart`);
    // You can add logic to remove the item from the cart based on the 'item' object
  };
  const cartNavigate = (item) => {
    navigate(`/product/${item.id}`)
  }
  const excactCartNavigate = (item) => {
    navigate(`/cart/${item.id}`)
  }

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
           
            <Link to="/" style={{ textDecoration: 'none' }}>
              <IconButton color="primary" aria-label="open drawer" sx={{ mr: 2 }}>
                <HomeIcon style={{ color: '#fff' }} />
              </IconButton>
            </Link>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            ></Typography>
            <IconButton color="primary" aria-label="open drawer" sx={{ mr: 2 }} onClick={handleCartClick}>
              <Badge badgeContent={itemsCount} color="secondary">
                <ShoppingCartIcon style={{ color: '#fff' }} />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {cartItems.length === 0 ? (
                <MenuItem disabled>No items in cart</MenuItem>
              ) : (
                
              
                cartItems.map((item) => (
                  <MenuItem key={item.id} >
                    <Typography variant="inherit" style={{ marginRight: '10px' }}  onClick={  () => cartNavigate(item)}>{item.name}</Typography>
                    <Typography key={item.id} variant="body2" sx={{ mr: 2 }}>
                      {item.quantity + "x"}: ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                    <Button 
                    variant="outlined"
                    style={{ color: 'green' }} onClick={() => handleQuantityUpdate(item, item.quantity + 1)}>
                      <AddIcon />
                    </Button>
                    <Button
                    variant="outlined"
                    style={{ color: 'red' }}  onClick={() => handleQuantityUpdate(item, Math.max(item.quantity - 1, 1))}>
                      <RemoveIcon />
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => removeItemFromCart(item)}
                    >
                      Remove
                    </Button>
                  </MenuItem>
                  
                ))
                
              )}
              <MenuItem disabled>-----</MenuItem>
              <MenuItem onClick={handleClose}>Total Price: ${totalPrice.toFixed(2)}</MenuItem>
              <MenuItem>
                <Button variant="contained" onClick={clearCart}>
                  New Cart
                </Button>
              </MenuItem>
              {user && (
                <div>
                <MenuItem>
                  <Button
                    variant="contained"
                    onClick={() => deleteCart(
                      JSON.parse(localStorage.getItem('cartId'))
                    )}
                  >
                    Remove Cart
                  </Button>
                </MenuItem><MenuItem>
                      <Button variant="contained"
                      onClick={() => excactCartNavigate(
                        JSON.parse(localStorage.getItem('cartId'))
                      )}
                      >
                        Show Cart
                      </Button>
                  </MenuItem></div>
                )}
          
              {/* Other components... */}
            </Menu>
            <IconButton
              color="inherit"
              aria-label="open user menu"
              onClick={handleUserIconClick}
              sx={{ mr: 2 }}
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              anchorEl={userAnchorEl}
              open={Boolean(userAnchorEl)}
              onClose={handleUserMenuClose}
            >
              {user && user.email !== "" && user.name !== "" && user.surname !== "" ? (
                <div>
                  <MenuItem>
                    <Button variant="contained" onClick={handleLogout}>
                      Logout
                    </Button>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/cart" style={{ textDecoration: 'none' }}>
                      <Button variant="contained">
                        My Carts
                      </Button>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/account" style={{ textDecoration: 'none' }}>
                      <Button variant="contained">
                        Manage Account
                      </Button>
                    </Link>
                  </MenuItem>
                  {user && user.email !== "" && user.name !== "" && user.role === "admin" ? (
                  <MenuItem>
                    <Link to="/admin/orders" style={{ textDecoration: 'none' }}>
                      <Button variant="contained">
                        Manage Orders
                      </Button>
                    </Link>
                  </MenuItem>
                  ):(
                    <div></div>
                  )}
                </div>
              ) : (
                <MenuItem>
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    <Button variant="contained">
                      Login
                    </Button>
                  </Link>
                </MenuItem>
              )}
            </Menu>
            


          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
};

export default ToolbarComponent;
