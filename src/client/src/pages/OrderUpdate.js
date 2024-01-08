import React, { Component } from "react";
import { Button, Container, TextField, Grid } from "@mui/material";
import {
  fetchData,
  deleteData,
  updateData,
  insertData,
  getOrderInfo,
  getOrderProductsItems,
  updateOrderState,
} from "../api/Api";
import CardComponent from "../components/CardComponent";
import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import PropertyTable from "../components/PropertyTable";

class OrderUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderInfo: null,
      productsList: null,
      orderState: "Pending",
    };

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token || user.role !== "admin") {
      window.location.replace("/");
      return;
    }
  }

  handleChange = (event) => {
    const newState = event.target.value;
    this.setState({ orderState: newState });
  };

  isCancelationPossible = () => {
    const orderInfo = this.state.orderInfo;
    console.log(orderInfo.State);
    return (
      orderInfo && (orderInfo.State === "Pending" || orderInfo.State === "Paid")
    );
  };

  changeOrderStateHandle = (e) => {
    let newState = this.state.orderState;
    console.log(e);
    if (e.target.id === "cancel-order") {
      if (!this.isCancelationPossible()) {
        return;
      } else {
        newState = "Canceled";
      }
    }

    const user = JSON.parse(localStorage.getItem("user"));

    updateOrderState(this.state.orderInfo["Order id"], {
      orderState: newState,
      token: user.token,
    }).then(() => {
      window.location.reload();
    });
  };
  componentDidMount() {
    const user = JSON.parse(localStorage.getItem("user"));
    const locationArr = window.location.href.split("/");
    const orderId = locationArr[locationArr.length - 1];
    console.log(orderId);
    getOrderInfo(user.token, orderId).then((response) => {
      const { id, cost, items, orderDate, state, user_id } =
        response.data.order;
      this.setState({
        orderInfo: {
          "Order id": id,
          "Total Cost": cost,
          "Created Date": orderDate,
          State: state,
          "User id": user_id,
        },
        productsList: items,
        orderState: state,
      });
      console.log(response.data);
    });
    // getOrderProductsItems(user.token).then((response) => {
    //   this.setState({
    //     orderProductsItems: response.data,
    //   });
    // });
  }

  render() {
    const orderInfo = this.state.orderInfo;
    const productsList = this.state.productsList;
    return (
      <div>
        {this.state.orderInfo ? (
          <>
            <Paper elevation={3} style={{ margin: "20px", padding: "20px" }}>
              <Button variant="contained" component={Link} to="/">
                Back to App
              </Button>
              <div style={{ marginBottom: "3rem" }}></div>
              <h3>Change the status</h3>
              <Paper
                elevation={3}
                style={{ margin: "20px 0px", padding: "20px" }}
              >
                <FormControl>
                  <InputLabel>Order State</InputLabel>
                  <Select
                    value={this.state.orderState}
                    onChange={this.handleChange}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Paid">Paid</MenuItem>
                    <MenuItem value="Invoiced">Invoiced</MenuItem>
                    <MenuItem value="In Delivery">In Delivery</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem disabled={true} value="Canceled">
                      Canceled
                    </MenuItem>
                  </Select>
                  <Button onClick={this.changeOrderStateHandle}>Submit</Button>
                  {this.isCancelationPossible() && (
                    <Button
                      id="cancel-order"
                      onClick={this.changeOrderStateHandle}
                    >
                      Cancel Order
                    </Button>
                  )}
                </FormControl>
              </Paper>
              <Paper
                elevation={3}
                style={{ margin: "20px 0px", padding: "20px" }}
              >
                <div style={{ marginBottom: "3rem" }}></div>
                <h2>Order Details</h2>
                <Paper
                  elevation={3}
                  style={{ margin: "20px 0px", padding: "20px" }}
                >
                  <PropertyTable data={orderInfo} />
                </Paper>
                <h3>Products</h3>
                <Paper
                  elevation={3}
                  style={{ margin: "20px 0px", padding: "20px" }}
                >
                  {productsList &&
                    Object.entries(productsList).map(([key, value]) => (
                      <div key={key} style={{ marginBottom: "3rem" }}>
                        <PropertyTable data={value} />
                        <Divider />
                      </div>
                    ))}
                </Paper>
              </Paper>
            </Paper>
          </>
        ) : (
          <strong>Invalid Order Number</strong>
        )}
      </div>
    );
  }
}

export default OrderUpdate;
