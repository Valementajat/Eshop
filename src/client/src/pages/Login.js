import React, { Component } from 'react';
import { Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleLogin = () => {
    // Perform login logic here
  };

  render() {
    return (
      <div className="login-container">
        <h2>Login</h2>
        <div>
          <TextField
            name="username"
            label="Username"
            value={this.state.username}
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
      </div>
    );
  }
}

export default Login;
