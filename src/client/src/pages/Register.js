import React, { Component } from "react";
import { Button, TextField, Alert } from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import { registerUser } from "../api/Api";


class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      surname: "",
      password: "",
      passwordAgain: "",
      email: "",
      message: null,
      warning: null,
      error: null,
    };

    const user = JSON.parse(localStorage.getItem('user'));
    

    if (user && user.token) {
      window.location.replace('/');
    }
  }



  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  validateState = () => {
    const { name, surname, email, password } = this.state;

    // Add your custom validation rules here
    if (!name || !surname || !email || !password) {
      this.setState({ warning: 'Please fill in all fields.' });
      return false;
    }

    // Example: Check if the email has a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.setState({ warning: 'Please enter a valid email address.' });
      return false;
    } else if (this.state.password !== this.state.passwordAgain) {
      this.setState({ warning: "The passwords don't match" });
      return false;
    }
    return true;
  };

  handleRegister = async () => {
    // VALIDATE VALUES
    if (!this.validateState()) {
      return; // Stop registration if validation fails
    }
    this.setState({warning : null})

    const { name, surname, email, password } = this.state;

    try {
      const res = await registerUser({ name, surname, email, password });
      const token = res.data.token;
      localStorage.setItem('user', JSON.stringify({id:res.data.id, token, name, surname, email, role:res.data.role}));

      // Reset error state on successful registration
      this.setState({ error: null });
      this.setState({ message: res.data.message });
      window.location.replace('/');

    } catch (error) {
      // Handle specific error codes and set the error state accordingly
      if (error.response) {
        if (error.response.status === 400) {
          this.setState({ error: 'Email already exists.' });
        } else {
          this.setState({ error: 'Registration failed. Please try again later.' });
        }
      } else {
        this.setState({ error: 'Network error. Please check your internet connection.' });
      }
    }
  };

  render() {
    return (
      <div className="login-container">
        <h2>Sign Up</h2>
        
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
        <Button variant="contained" onClick={this.handleRegister}>
          Sign Up
        </Button>

        <p>
          Have an account? <Link to="/login">Log In</Link>
        </p>
        <Button variant="contained" component={Link} to="/">
          Back to App
        </Button>
        <div className="mt-3">
          {this.state.warning && (
            <Alert severity="warning">{this.state.warning}</Alert>
          )}
          {this.state.error && (
            <Alert severity="error">{this.state.error}</Alert>
          )}
        </div>
      </div>
    );
  }
}

export default Register;
