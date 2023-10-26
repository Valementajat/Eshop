import React, { Component } from 'react';
import './App.css';
import { Button, Container, TextField, Grid } from '@mui/material';
import { fetchData, insertData, deleteData, updateData } from './Api';
import CardComponent from './CardComponent';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setBookName: '',
      setReview: '',
      fetchData: [],
      reviewUpdate: '',
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
    fetchData()
      .then((response) => {
        this.setState({
          fetchData: response.data,
        });
      });
  }

  submit = () => {
    insertData(this.state)
      .then(() => { alert('success post') });
    console.log(this.state);
    document.location.reload();
  }

  remove = (id) => {
    if (window.confirm("Do you want to delete? ")) {
      deleteData(id);
      document.location.reload();
    }
  }

  edit = (id) => {
    updateData(id, this.state);
    document.location.reload();
  }

  render() {
    if (!Array.isArray(this.state.fetchData)) {
      return <div>Loading...</div>;
    }

    return (
      <div className='App'>
        <div className='form'>
          <TextField name='setBookName' label='Enter Book Name' onChange={this.handleChange} />
          <TextField name='setReview' label='Enter Review!!' onChange={this.handleChange} />
        </div>
        <Button className='my-2' variant="contained" onClick={this.submit}>Submit</Button> <br /><br />
        <Container>
          <Grid container spacing={2}>
            <CardComponent
              data={this.state.fetchData}
              handleChange2={this.handleChange2}
              edit={this.edit}
              remove={this.remove}
            />
          </Grid>
        </Container>
      </div>
    );
  }
}

export default App;
