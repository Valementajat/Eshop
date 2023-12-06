import React, { Component } from "react";
import "../css/App.css";
import { Button, Container, TextField, Grid } from "@mui/material";
import { fetchData, deleteData, updateData, insertData, updatedCartItemsQuantity, removeCart, switchCart } from "../api/Api";
import CardComponent from "../components/CardComponent";
import { Link } from "react-router-dom";
import TopAppBarUser from "../components/TopBarComponent";
import TopAppBar from "../components/AddbarComponent";
import Cart from "../components/Cart";
import { addToCart as addToCartCall } from "../api/Api";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setBookName: "",
      setReview: "",
      fetchData: [],
      cartItems: [], 
      cartId: 0,
      reviewUpdate: "",
      user: { name: "", surname: "", isAdmin: false, email: "" },
      showProductForm: false, // New state to show the product form
    };
  }
  addToCart = (item) => {
  const quantity = parseInt(item.quantity);
  const newItem = { ...item, quantity: isNaN(quantity) ? 1 : quantity };
  
  const user = JSON.parse(localStorage.getItem("user"));
  // If the user is logged in, save the cart data to the database
  
    
    try {
      const cartId = this.state.cartId;
      const userId = user.id;
      if (this.state.user) {
      addToCartCall( userId,  newItem, cartId ).then((response) => {
        // Update state with the new cart items received from the API response
        this.setState({
          cartItems: response.data.cartItems,
          cartId: response.data.cartId,
          // You might receive updated cart data in response, adjust this part accordingly
          // Make sure the API response structure matches your state structure
          // cartId: response.data.cartId, // Update cartId if necessary
        });
      }).catch((error) => {
        console.error('Error adding item to cart:', error);
      });
    } else {
      // If the user is not logged in, update local state with the new item
      this.setState((prevState) => ({
        cartItems: [...prevState.cartItems, newItem],
      }));
    }
    
    // Call your API endpoint to add the item to the cart in the database
    // Example: insertCartItem(this.state.user.id, newItem);
    // Replace 'insertCartItem' with your actual API function to add cart items
  } catch (error) {
    console.error('Error fetching user carts:', error);
  }
  };
 

  
  updateQuantity = (itemToUpdate, newQuantity) => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const cartId = this.state.cartId;
      if (this.state.user) {
        updatedCartItemsQuantity(  itemToUpdate, cartId, newQuantity ).then((response) => {
     
        
        const updatedCartItems = this.state.cartItems.map(item => {
          if (item.id === itemToUpdate.id) {
            // Ensure the new quantity is a valid number
            const quantity = parseInt(newQuantity);
            return { ...item, quantity: isNaN(quantity) ? 0 : quantity };
          }
          return item;
        });
        this.setState({ cartItems: updatedCartItems });
      }).catch((error) => {
        console.error('Error adding item to cart:', error);
      });
    } else {
      // If the user is not logged in, update local state with the new item
      const updatedCartItems = this.state.cartItems.map(item => {
        if (item.id === itemToUpdate.id) {
          // Ensure the new quantity is a valid number
          const quantity = parseInt(newQuantity);
          return { ...item, quantity: isNaN(quantity) ? 0 : quantity };
        }
        return item;
      });
      this.setState({ cartItems: updatedCartItems });
    }}
    catch (error) {
      console.error('Error updating carts:', error);
    }
    
  }; 


  removeFromCart = (itemToRemoves) => {
    const cartId = this.state.cartId;
try{
    updatedCartItemsQuantity( itemToRemoves, cartId, 0 ).then((response) => {
      console.log("Vittuakos täs");
      console.log(itemToRemoves);
      const updatedCartItems = this.state.cartItems.filter(item => item.id !== itemToRemoves.id);
      this.setState({ cartItems: updatedCartItems });
      console.log(updatedCartItems);

    })
    
    
  } catch (error) {
    
    
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
    localStorage.removeItem("user");
    window.location.replace("/login");
  };

  submit = () => {
    insertData(this.state).then(() => {
      alert("success post");
    });
    console.log(this.state);
    document.location.reload();
  };

  remove = (id) => {
    if (window.confirm("Do you want to delete? ")) {
      deleteData(id);
      document.location.reload();
    }
  };

  clear = () => {
    this.setState({ cartItems: [], cartId: 0 });

  };
  deleteCart = () => {
    const cartId = this.state.cartId;
    if (cartId){
      removeCart( cartId ).then((response) => {
        this.clear();
      });
    }
  }

  switchCarts = (cartId) => {
    switchCart( cartId ).then((response) => {
      console.log(cartId);
      console.log(response);
      this.setState({
        cartItems: response.data.cartItems,
        cartId: response.data.cartId,
        // You might receive updated cart data in response, adjust this part accordingly
        // Make sure the API response structure matches your state structure
        // cartId: response.data.cartId, // Update cartId if necessary
      });
    });

  }

  edit = (id) => {
    updateData(id, this.state);
    document.location.reload();
  };

  render() {
    if (!Array.isArray(this.state.fetchData)) {
      return <div>Loading...</div>;
    }

    const user = this.state.user;

    const { cartItems } = this.state; 
    return (
      <div className="App">
            <div>
        {!user && (
          <div>
          <TopAppBar/>
        
        </div>
        )}

          {user && (
            <div>
              {user.name !== "" || user.surname !== "" ? (
                <span>
                   <div>
            <TopAppBarUser/></div>

                  Hello, {user.name} {user.surname}
                </span>
              ) : (
                user.email && <span>Hello, {user.email}</span>
              )}
              <br />
              <Button className="my-2" variant="contained" onClick={this.clear}>
              New Cart
            </Button>
            <Button className="my-2" variant="contained" onClick={this.deleteCart}>
              Remove Cart
            </Button>
            <Button className="my-2" variant="contained" onClick={() => this.switchCarts(35)}>
              Switch Cart
            </Button>
            <Cart
              cartItems={this.state.cartItems}
              removeFromCart={this.removeFromCart}
              updateQuantity={this.updateQuantity} // Pass the updateQuantity function
            />
              <Button
                className="my-2"
                variant="contained"
                onClick={this.logout}
              >
                Log Out
              </Button>
              <Link to="account">
                <Button className="my-2" variant="contained">
                  Manage Account
                </Button>
              </Link>
              <Link to="cart">
                <Button className="my-2" variant="contained">
                  My Carts
                </Button>
              </Link>
              {user && user.role == "admin" && (
                <Link to="admin/orders">
                  <Button className="my-2" variant="contained">
                    Manage Orders
                  </Button>
                </Link>
              )}
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
            <Button className="my-2" variant="contained" onClick={this.submit}>
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
              addToCart={this.addToCart} 
            />
          </Grid>
        </Container>
        
      </div>
    );
  }
}

export default App;
