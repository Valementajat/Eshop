import React, { Component } from "react";
import "../css/App.css";
import { Button, Container, TextField, Grid } from "@mui/material";
import { fetchData, deleteData, updateData, insertData } from "../api/Api";
import CardComponent from "../components/CardComponent";
import { Link } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setBookName: "",
      setReview: "",
      fetchData: [],
      reviewUpdate: "",
      user: { name: "", surname: "", isAdmin: false, email: "" },
      showProductForm: false, // New state to show the product form
    };
  }

  handleChange = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({
      [nam]: val,
    });
  };

  handleChange2 = (event) => {
    this.setState({
      reviewUpdate: event.target.value,
    });
  };

  componentDidMount() {
    fetchData().then((response) => {
      this.setState({
        fetchData: response.data,
      });
    });
    try {
      this.setState({ user: JSON.parse(localStorage.getItem("user")) });
    } catch (err) {}
  }

  logout = () => {
    localStorage.removeItem('user');
    window.location.replace('/login');
  };

  submit = () => {
    insertData(this.state)
      .then(() => { alert('success post') });
    console.log(this.state);
    document.location.reload();

  };

  remove = (id) => {
    if (window.confirm("Do you want to delete? ")) {
      deleteData(id);
      document.location.reload();
    }
  };

  edit = (id) => {
    updateData(id, this.state);
    document.location.reload();
  };

  render() {
    if (!Array.isArray(this.state.fetchData)) {
      return <div>Loading...</div>;
    }

    const user = this.state.user;
    const { showProductForm } = this.state;

    return (
      <div className="App">
        <div>
          {user && (
            <div>
              {user.name !== "" || user.surname !== "" ? (
                <span>
                  Hello, {user.name} {user.surname}
                </span>
              ) : (
                user.email && <span>Hello, {user.email}</span>
              )}
              <br />
              
              <Button
                className="my-2"
                variant="contained"
                onClick={this.logout}
              >
                Log Out
              </Button>
              <Link to="account">
                <Button
                  className="my-2"
                  variant="contained"
                >
                  Manage Account
                </Button>
              </Link>
            </div>
          )}
        </div>
        {user && user.role === "admin" && (
          <div className="form">
            <TextField
              name="setBookName"
              label="Enter Name"
              value={this.state.setBookName}
              onChange={this.handleChange}
            />
            <TextField
              name="setReview"
              label="Enter Review!!"
              value={this.state.setReview}
              onChange={this.handleChange}
            />
            <Button
              className="my-2"
              variant="contained"
              onClick={this.submit}
            >
              Submit
            </Button>
            <br />
          </div>
        )}
       
        <br />
        <hr />
        <br />
        <Container>
          <Grid container spacing={2}>
            <CardComponent
              data={this.state.fetchData}
              handleChange2={this.handleChange2}
              edit={this.edit}
              remove={this.remove}
              user={user}
            />
          </Grid>
        </Container>
        {!user && (
          <div>
            <Link to="/login">
              <Button className="my-2" variant="contained">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="my-2" variant="contained">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    );
  }
}

export default App;
