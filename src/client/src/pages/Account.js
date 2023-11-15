import React, { Component } from "react";
import { Button, TextField, Alert } from "@mui/material";
import { Link } from "react-router-dom";

class Account extends Component {
 constructor(props) {
    super(props);
    this.state = {
      message: null,
    };
    const localUser = JSON.parse(localStorage.getItem("user"));

    if (!localUser || !localUser.token) {
      window.location.replace("/");
    } 
 }

 handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
 };

 logout = () => {
    // Remove the user from local storage
    localStorage.removeItem("user");

    // Optionally, redirect the user to the login page or another page
    window.location.replace("/login");
 };

 render() {
    const user = JSON.parse(localStorage.getItem("user"));

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
        
      </div>
    );
 }

 render() {
  return (
     <div className="login-container">

       <button onClick={this.handleButton1Click}>Increase</button>

       <button onClick={this.handleButton2Click}>Decrease</button>

       <div>{this.state.text}</div>
     </div>
  );
 }
}

export default Account;