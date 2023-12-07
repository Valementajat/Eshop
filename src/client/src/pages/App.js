import React, { Component } from "react";
import "../css/App.css";
import { Button, Container, TextField, Grid } from "@mui/material";
import { fetchData, deleteData, updateData, insertData, updatedCartItemsQuantity, removeCart, switchCart,createCartFromLocal } from "../api/Api";
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
      
      if (this.state.user) {
        const cartId = this.state.cartId;
      const userId = user.id;
      addToCartCall( userId,  newItem, cartId ).then((response) => {
        // Update state with the new cart items received from the API response
        this.setState({
          cartItems: response.data.cartItems,
          cartId: response.data.cartId,
          // You might receive updated cart data in response, adjust this part accordingly
          // Make sure the API response structure matches your state structure
          // cartId: response.data.cartId, // Update cartId if necessary
        });
        localStorage.setItem('cartId', JSON.stringify({id:cartId}));

      }).catch((error) => {
        console.error('Error adding item to cart:', error);
      });
    } else {
      // If the user is not logged in, update local state with the new item
      let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      cartItems.push(newItem);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
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
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const cartId = this.state.cartId;
      if (user) {
        // If the user is logged in, update the cart items in the database
        updatedCartItemsQuantity(itemToUpdate, cartId, newQuantity)
          .then((response) => {
            const updatedCartItems = this.state.cartItems.map((item) => {
              if (item.id === itemToUpdate.id) {
                // Ensure the new quantity is a valid number
                const quantity = parseInt(newQuantity);
                return { ...item, quantity: isNaN(quantity) ? 0 : quantity };
              }
              return item;
            });
            this.setState({ cartItems: updatedCartItems });
          })
          .catch((error) => {
            console.error('Error updating cart items in the database:', error);
          });
      } else {
        // If the user is not logged in, update the local state with the new item quantity
        const updatedCartItems = this.state.cartItems.map((item) => {
          if (item.id === itemToUpdate.id) {
            // Ensure the new quantity is a valid number
            const quantity = parseInt(newQuantity);
            return { ...item, quantity: isNaN(quantity) ? 0 : quantity };
          }
          return item;
        });
        this.setState({ cartItems: updatedCartItems });
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems)); // Update local storage
      }
    } catch (error) {
      console.error('Error updating carts:', error);
    }
  };
  


  removeFromCart = (itemToRemoves) => {
    const cartId = this.state.cartId;
try{
    updatedCartItemsQuantity( itemToRemoves, cartId, 0 ).then((response) => {
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
        const maybeCartId =  JSON.parse(localStorage.getItem("cartId")) 
        const user = JSON.parse(localStorage.getItem("user"));
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.setState({ cartItems });
        if (maybeCartId === undefined || maybeCartId === null) {

          this.setState({ cartId: 0  });
          const cartId = this.state.cartId;

          if (user && cartItems.length > 0) {
            createCartFromLocal(cartItems, user.id).then((response) => {
              this.setState({
                cartItems: response.data.cartItemss,
                cartId: response.data.cartId,
                // You might receive updated cart data in response, adjust this part accordingly
                // Make sure the API response structure matches your state structure
                // cartId: response.data.cartId, // Update cartId if necessary
              });
              localStorage.removeItem("cartItems");
              localStorage.setItem('cartId', JSON.stringify({id:cartId}));
      
            })

           }
        } else  {
          this.switchCarts(maybeCartId.id);
        }

    } catch (err) {}
  }

  logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cartId");
    localStorage.removeItem("cartItems");
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
    localStorage.removeItem("cartItems");

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
          <Button className="my-2" variant="contained" onClick={this.clear}>
              New Cart
            </Button>
            {user && (
            <Button className="my-2" variant="contained" onClick={this.deleteCart}>
              Remove Cart
            </Button>
              )}
            <Cart
              cartItems={this.state.cartItems}
              removeFromCart={this.removeFromCart}
              updateQuantity={this.updateQuantity} // Pass the updateQuantity function
            />
        </div>
       

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
