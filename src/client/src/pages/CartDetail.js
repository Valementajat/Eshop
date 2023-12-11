import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import { getCartDetails, removeCart, createUserOrder } from '../api/Api';
import ProductList from '../components/ProductList';

const CartDetail = () => {
  const { id } = useParams();
  const [cartDetails, setCartDetails]  = useState(null)
  const [cartProducts, setCartProducts]  = useState(null)
  const user = JSON.parse(localStorage.getItem("user"));

  // Assume you have a function to get cart details by id
  useEffect(() => {
    console.log(id);
    if (!user || !user.token) {
      window.location.replace("/");
      return;
    }
    getCartDetails(user.id, parseInt(id) ).then((res) => {
      setCartDetails(res.data.cartDetails)
      setCartProducts(res.data.cartProducts)

    }
    
    )}, [user.id, id])
  

  //const cartDetails = getCartDetailsById(id);

  if (!cartDetails) {
    return <div>Cart not found</div>;
  }

  const handleTurnIntoOrder = () => {
    // Implement logic to turn the cart into an order
    console.log(`Turning cart ${id} into an order`);
    createUserOrder( parseInt(id), user.id ).then((response) => {
      handleDeleteCart();
      

    });
    
  };

  const handleDeleteCart = () => {
    // Implement logic to delete the cart
    removeCart( id ).then((response) => {
      localStorage.removeItem("cartId");
    });
    window.location.replace("/cart");
  };

  return (
    <div>
      <h2>Cart Details</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={cartDetails.id}>
              <TableCell>{cartDetails.id}</TableCell>
              <TableCell>{cartDetails.name}</TableCell>
              <TableCell>{cartDetails.cost}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <h3>Products</h3>
      <ProductList productList={cartProducts} />

      <Button variant="contained" color="primary" onClick={handleTurnIntoOrder}>
        Turn into Order
      </Button>
      <Link to="cart">

        <Button variant="contained" color="secondary" onClick={handleDeleteCart}>
          Delete Cart
        </Button>
      </Link>

    </div>
  );
};

export default CartDetail;
