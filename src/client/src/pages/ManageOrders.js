import React, { Component } from 'react';
import { Button, TextField, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { getAllOrders } from '../api/Api';
import OrdersTable from '../components/OrdersTable';

class ManageOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryUserId: -1,
      queryEmail: '',
      querySurname: '',
      error: null,
      message:null,
      orders:[],
    };
    const user = JSON.parse(localStorage.getItem('user'));
    

    if (!user || !user.token || user.role !== "admin" ) {
      window.location.replace('/');
      return;
    }

  }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem('user'));

    try {
        getAllOrders(user.token).then((response) => {
         
          this.setState({
            orders: response.data.orders,
           
          });
         console.log(response.data.orders);
        });
      } catch (error) {
        console.error('Error fetching user orders:', error);
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
        <Link to="/">
        <Button>
            Go Home (Please)
        </Button>
        </Link>
        <h2>Manage Orders</h2>

        <OrdersTable orders={this.state.orders}/>

        
      </div>
    );
  }
}

export default ManageOrders;
