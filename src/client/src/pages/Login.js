import React, { Component } from 'react';
import { Button, TextField, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { loginUser } from '../api/Api';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null,
      message:null,
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

  handleLogin = async () => {

    try {

      // Validate the form fields
      if (!this.state.email || !this.state.password) {
        this.setState({ error: 'Please fill in all fields.' });
        return;
      }

      const res = await loginUser({ email:this.state.email, password:this.state.password });
      const {name, surname, email, token} = res.data;
      console.log(res);

      //console.log(name, surname, email, token);
      localStorage.setItem('user', JSON.stringify({token, name, surname, email}));

      // Reset error state on successful log-in
      this.setState({ error: null });
      this.setState({ message: res.data.message });
      window.location.replace('/');

    } catch (error) {
      // Handle specific error codes and set the error state accordingly
      if (error.response) {
        if (error.response.status === 401) {
          this.setState({ error: 'Invalid email or password.' });
        } else {
          this.setState({ error: 'Login failed. Please try again later.' });
        }
      } else {
        this.setState({ error: 'Network error. Please check your internet connection.' });
      }
    }
    };

  render() {
    return (
      <div className="login-container">
        <h2>Login</h2>
        <div>
          <TextField
            type="email"
            name="email"
            label="Email"
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
        <Button variant="contained" onClick={this.handleLogin}>
          Login
        </Button>
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
        <Button variant="contained" component={Link} to="/">
          Back to App
        </Button>
        <div className="mt-3">
          {this.state.warning && (
            <Alert severity="success">{this.state.message}</Alert>
          )}
          {this.state.error && (
            <Alert severity="error">{this.state.error}</Alert>
          )}
        </div>
      </div>
    );
  }
}

export default Login;
