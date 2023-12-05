import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
} from '@mui/material';

const OrdersList = ({ orders, isAdmin=false }) => {
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [filter, setFilter] = useState('');


  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredOrders = orders.filter(
    (order) => 
      order.ID.toString().includes(filter) ||
      order.orderDate.includes(filter) ||
      order.state.includes(filter) ||
      order.cost.toString().includes(filter) ||
      (isAdmin && order.user_ID.toString().includes(filter))
    );

  const sortedOrders = filteredOrders.sort((a, b) => {
    const orderValue = order === 'desc' ? -1 : 1;
    return (a[orderBy] < b[orderBy] ? -1 : 1) * orderValue;
  });


  return (
    <div>
      <TextField
        label="Filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'ID'}
                  direction={orderBy === 'ID' ? order : 'asc'}
                  onClick={() => handleSort('ID')}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'orderDate'}
                  direction={orderBy === 'orderDate' ? order : 'asc'}
                  onClick={() => handleSort('orderDate')}
                >
                  Order Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'state'}
                  direction={orderBy === 'state' ? order : 'asc'}
                  onClick={() => handleSort('state')}
                >
                  State
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'cost'}
                  direction={orderBy === 'cost' ? order : 'asc'}
                  onClick={() => handleSort('cost')}
                >
                  Cost
                </TableSortLabel>
              </TableCell>
              {isAdmin && (
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'user_ID'}
                    direction={orderBy === 'user_ID' ? order : 'asc'}
                    onClick={() => handleSort('user_ID')}
                  >
                    User ID
                  </TableSortLabel>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedOrders.map((order) => {
              console.log(order);
              return (
              <TableRow key={order.ID}>
                <TableCell>{order.ID}</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                <TableCell>{order.state}</TableCell>
                <TableCell>{order.cost}</TableCell>
                {isAdmin && <TableCell>{order.user_ID}</TableCell>}
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default OrdersList;
