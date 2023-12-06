import React, { Component } from "react";
import { Button, TextField, Alert, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { getAllOrders } from "../api/Api";
import OrdersTable from "../components/OrdersTable";
import OrdersList from "../components/OrdersList";

class ManageOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryUserId: -1,
      queryEmail: "",
      querySurname: "",
      error: null,
      message: null,
      orders: [],
    };
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token || user.role !== "admin") {
      window.location.replace("/");
      return;
    }
  }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      getAllOrders(user.token).then((response) => {
        this.setState({
          orders: response.data.orders,
        });
      });
    } catch (error) {
      console.error("Error fetching user orders:", error);
    }
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    return (
      <div>
        <Paper elevation={3} style={{ margin: "20px", padding: "20px" }}>
          <Link to="/">
            <Button>Go Home (Please)</Button>
          </Link>
          <h2>Manage Orders</h2>

          <Paper elevation={3} style={{ margin: "20px 0px", padding: "20px" }}>
            <OrdersList orders={this.state.orders} isAdmin={true} />
          </Paper>
        </Paper>
      </div>
    );
  }
}

export default ManageOrders;
