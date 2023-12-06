import React, { useEffect, useState } from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { getOrderInfo, updateOrderState } from "../api/Api";

const OrderDetail = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrderInfo(user.token, parseInt(id)).then((res) => {
      setOrder(res.data.order);
    });
  }, []);

  if (!order) return <div>Invalid Order ID</div>;

  const handleCancelOrder = () => {
        
        updateOrderState(id, {orderState:"Canceled", token:user.token}).then(() => {
          window.location.reload();
        });
  }
  return (
    <div>
      <Typography variant="h4">Order Details</Typography>
      <Paper elevation={3} style={{ margin: "20px", padding: "20px" }}>
        <Typography variant="h6">Order ID: {order.ID}</Typography>
        <Typography variant="body1">
          Order Date: {new Date(order.orderDate).toLocaleDateString()}
        </Typography>
        <Typography variant="body1">State: {order.state}</Typography>
        <Typography variant="body1">User ID: {order.user_ID}</Typography>
        <Typography variant="body1">Total Cost: {order.cost}</Typography>

        {order && (order.state == "Pending" || order.state == "Paid") && (
          <Button onClick={handleCancelOrder} color="error">Cancel Order</Button>
        )}
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Order Items
        </Typography>
        <TableContainer component={Paper} style={{ marginTop: "10px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Cost</TableCell>
                {/* Add more headers for additional properties */}
              </TableRow>
            </TableHead>
            <TableBody>
              {order &&
                order.items &&
                order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.cost}</TableCell>
                    {/* Add more cells for additional properties */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default OrderDetail;
