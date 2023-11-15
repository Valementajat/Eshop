import React, { Component } from "react";
import { Button, TextField, Alert } from "@mui/material";
import { Link } from "react-router-dom";
import { deleteUser, updateUser } from "../api/Api";

class AccountUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      surname: "",
      password: "",
      passwordAgain: "",

      warning: null,
      message: null,
      error: null,
    };
    const localUser = JSON.parse(localStorage.getItem("user"));

    if (!localUser || !localUser.token) {
      window.location.replace("/");
    } 
  }

  componentDidMount() {
    const localUser = JSON.parse(localStorage.getItem("user"));

    this.setState({
      email: localUser.email,
      name: localUser.email,
      surname: localUser.surname,
    });
  }

  logout = () => {
    // Remove the user from local storage
    localStorage.removeItem("user");

    // Optionally, redirect the user to the login page or another page
    window.location.replace("/login");
  };

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  validateState = () => {
    const { name, surname, email, password, passwordAgain } = this.state;

    // Add your custom validation rules here
    if (!name || !surname || !email) {
      this.setState({ warning: 'Name, Surname, Email can\'t be blank' });
      return false;
    }

    // Example: Check if the email has a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.setState({ warning: 'Please enter a valid email address.' });
      return false;
    } else if (password !== passwordAgain) {
      this.setState({ warning: "The passwords don't match" });
      return false;
    }
    return true;
  };


  handleUpdate = async () => {
    // VALIDATE VALUES
    if (!this.validateState()) {
      return; // Stop registration if validation fails
    }
    this.setState({ warning: null });

    const { name, surname, email, password } = this.state;

    try {
      //Get info from the local storage
      const localUser = JSON.parse(localStorage.getItem("user")); 
      const res = await updateUser({ name, surname, email, password, token:localUser.token });
      const token = res.data.token;
      //We save the info to see if someone is logged in 
      localStorage.setItem(
        "user",
        JSON.stringify({ token, name, surname, email, role: res.data.role })
      );

      // Reset error state on successful registration
      this.setState({ error: null });

      // eslint-disable-next-line no-restricted-globals
      alert(res.data.message);
      window.location.replace("/account");
    } catch (error) {
      // Handle specific error codes and set the error state accordingly
      if (error.response) {
          
          this.setState({ error: 'Invalid user token' });

          if (error.response.status === 401) {
            this.setState({ error: 'Invalid user token' });
          } else {
            
            this.setState({
              error: "Account update failed. Please try again later.",
              
            });
          }
        
      } else {
        this.setState({
          error: "Network error. Please check your internet connection.",
        });
      }
    }
  };

  handleDelete = async () => {
    
    this.setState({ warning: null });
      // eslint-disable-next-line no-restricted-globals
    if (confirm("Do your really want to delete your account") == false) {
      return;
    }
    try {
      const res = await deleteUser({ token:JSON.parse(localStorage.getItem("user")).token  });
      localStorage.setItem(
        "user",
        null
        )
      // eslint-disable-next-line no-restricted-globals
      alert("Your account was deleted");
      window.location.replace("/signup");
      
    } catch (error) {
      // Handle specific error codes and set the error state accordingly
      if (error.response) {
        
        if (error.response.status === 401) {
          this.setState({ error: 'Invalid user token' });
        } else {
          this.setState({
            error: "Account deletion failed. Please try again later.",
          });
        }
        
      } else {
        this.setState({
          error: "Network error. Please check your internet connection.",
        });
      }
    }
  };

  render() {
    const user = JSON.parse(localStorage.getItem("user"));
    return (
      <div className="login-container">
        <h2>Account info</h2>
        {user && (
          <div>
            <div>
              <TextField
                name="name"
                label="First Name"
                value={this.state.name}
                onChange={this.handleInputChange}
              />
            </div>
            <div>
              <TextField
                name="surname"
                label="Last Name(s)"
                value={this.state.surname}
                onChange={this.handleInputChange}
              />
            </div>
            <div>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={this.state.email}
                onChange={this.handleInputChange}
              />
            </div>
            <div>
              <TextField
                type="password"
                name="password"
                label="Password"
                value={this.state.password}
                onChange={this.handleInputChange}
              />
            </div>
            <div>
              <TextField
                type="password"
                name="passwordAgain"
                label="Password Again"
                value={this.state.passwordAgain}
                onChange={this.handleInputChange}
              />
            </div>
            <Button variant="contained" onClick={this.handleUpdate}>
              Submit Update
            </Button>
            <div className="mt-3">
            {this.state.message && (
                <Alert severity="info">{this.state.message}</Alert>
              )}
              {this.state.warning && (
                <Alert severity="warning">{this.state.warning}</Alert>
              )}
              {this.state.error && (
                <Alert severity="error">{this.state.error}</Alert>
              )}
            </div>
          </div>
        )}

        <Link to="/">
          <Button variant="contained">Home</Button>
        </Link>
        <Button className="my-2" variant="contained" onClick={this.logout}>
          Log Out
        </Button>
        <Link to="/account/">
          <Button variant="contained">Account Info</Button>
        </Link>
        <Button variant="contained" onClick={this.handleDelete}>Delete Account</Button>
      </div>
    );
  }
}

export default AccountUpdate;
