import React, { Component } from "react";
import "../css/App.css";
import { Button, Container, Grid } from "@mui/material";

import { fetchData, getRecommendationsWithoutTags, getRecommendationsByTag } from "../api/Api";
import CardComponent from "../components/CardComponent";
import { Link } from "react-router-dom";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchData: [],
      user: { name: "", surname: "", isAdmin: false, email: "" },
      showProductForm: false, // New state to show the product form
      recommendedProducts: [],
    };
  }
  

  componentDidMount() {
    fetchData().then((response) => {
      this.setState({
        fetchData: response.data,
      });
    });
   
    
    try {
      this.setState({ user: JSON.parse(localStorage.getItem("user")) });
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        getRecommendationsWithoutTags(user.id).then((response) => {
          this.setState({ recommendedProducts: response.data.recommendedProducts })
        });
      } else {

        getRecommendationsByTag(["espresso","machine"]).then((response) => {
          this.setState({ recommendedProducts: response.data.recommendedProducts })
        });
      }
        

    } catch (err) {}
  }

 
 

  
  

  
  render() {
    if (!Array.isArray(this.state.fetchData)) {
      return <div>Loading...</div>;
    }
    const { recommendedProducts } = this.state;
    const user = this.state.user;

  
    return (
      <div className="App">
            <div>
      
            
        </div>
        <br />
        <br />
        {recommendedProducts.length > 0 && (
          <Container>
            <h2>Recommended Products</h2>
            <br />

                  <Grid container spacing={2}>
                  <CardComponent
                    data={recommendedProducts}
                    addToCart={this.addToCart}
                  />
                </Grid>
          </Container>
        )}
       
        <br />
        <h2>Available Products</h2>
        <br />  <br />
        <Container>
          <Grid container spacing={2}>
            <CardComponent  
              
              data={this.state.fetchData} 
              addToCart={this.addToCart} 
              cartId={this.state.cartId}

            />
          </Grid>
        </Container>
        
      </div>
    );
  }
}

export default App;
