import React, { Component } from "react";
import { Button, Grid, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { getUserCarts, createUserOrder } from "../api/Api";
import CartDataTable from "../components/CartTable";

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      carts: [], // Initialize carts state
    };
    const localUser = JSON.parse(localStorage.getItem("user"));

    if (!localUser || !localUser.token) {
      window.location.replace("/");
    }
  }

  async componentDidMount() {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      console.log(user.id);
      getUserCarts({userId : user.id}).then((response) => {
       
        this.setState({
          carts: response.data.carts,
         
        });
       console.log(response.data.carts);
      });
    } catch (error) {
      console.error('Error fetching user carts:', error);
    }
  }

  logout = () => {
    localStorage.removeItem("user");
    window.location.replace("/login");
  };

 

  render() {
    const user = JSON.parse(localStorage.getItem("user"));
    const { carts } = this.state; // Destructure carts from state

    return (
      <div className="login-container">
        <h2>Account info</h2>
        {user && (
          <div>
            <div>
              <span><strong>Full Name: </strong></span>
              <span>{user.name + " " + user.surname}</span>
            </div>
            <div>
              <span><strong>Email: </strong></span>
              <span>{user.email}</span>
            </div>
            <hr />
          </div>
        )}
        <Link to="/">
          <Button variant="contained">
            Home
          </Button>
        </Link>
        <Button className="my-2" variant="contained" onClick={this.logout}>
          Log Out
        </Button>

        <Link to="/account/update">
          <Button variant="contained">
            Update Account
          </Button>
        </Link>
        <br />
        <br />

        <br />
        {/* {!carts && ( */}
        <Container>
         
            {/* Pass data and createOrder function to CartComponent */}
            <CartDataTable carts={carts}/>
        </Container>
         {/* )} */}
      </div>
    );
  }
}

export default Account;
