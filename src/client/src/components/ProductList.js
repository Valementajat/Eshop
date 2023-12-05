import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const ProductList = ({ productList }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Cost</TableCell>
            <TableCell>Counts</TableCell>
            <TableCell>Price</TableCell>
            {/* Add more headers for additional properties */}
          </TableRow>
        </TableHead>
        <TableBody>
          {productList.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.cost}</TableCell>
              <TableCell>{product.counts}</TableCell>
              <TableCell>{product.price}</TableCell>
              {/* Add more cells for additional properties */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductList;
