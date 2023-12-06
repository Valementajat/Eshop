import React from 'react';
import { useNavigate } from 'react-router-dom';
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

const CartsList = ({ carts }) => {
  const navigate = useNavigate();

  const handleCartClick = (cartId) => {
    // Redirect to CartDetailPage when a cart is clicked
    navigate(`/cart/${cartId}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Cost</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {carts.map((cart) => (
            <TableRow key={cart.ID}>
              <TableCell>{cart.ID}</TableCell>
              <TableCell>{cart.name}</TableCell>
              <TableCell>{cart.cost}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleCartClick(cart.ID)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CartsList;
