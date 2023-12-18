import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  getProductById,
  getReviewsByProductId,
  addReview,
  updatedCartItemsQuantity,
  addToCart,
  createCartFromLocal,
  switchCart,
} from "../api/Api"; // Import your API functions
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
// import CardComponent from './CardComponent';
// import Product from './Product';

// const ProductPage = ({ products, addToCart }) => {
//   return (
//     <div>
//       <h2>Product Listing</h2>
//       <CardComponent data={products} addToCart={addToCart} />
//       <hr />
//       <h2>Product</h2>
//       <Product />
//     </div>
//   );
// };

import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const ProductPage = () => {
  const location = useLocation();

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productQty, setProductQty] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [cartId, setCartId] = useState(0);
  const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem("cartItems")) || []  )

  const [newReview, setNewReview] = useState({
    comment: "",
    rating: 0,
  });

  useEffect(() => {
    // Fetch product data and reviews from the server using the product ID
    getProductAndReviews();
    getCartItems();
    setProductQty(getProductQty());
    console.log("On Load Info: ");
    console.log("CartID: ", cartId);
    console.log("CartItems: ", cartItems);
    console.log("ProductQty: ", productQty);

  }, []);

  useEffect(() => {
    setProductQty(getProductQty());
    console.log("On Change Info: ");
    console.log("CartID: ", cartId);
    console.log("CartItems: ", cartItems);
    console.log("ProductQty: ", productQty);

  }, [cartItems, cartId, productQty])


  const getCartItems = () => {
    try {
        const maybeCartId = JSON.parse(localStorage.getItem("cartId")).id
        const user = JSON.parse(localStorage.getItem("user"));
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        // Get Cart Items from server
        setCartItems(cartItems);
        if (maybeCartId === undefined || maybeCartId === null) {

          setCartId(0);

          if (user && cartItems.length > 0) {
            createCartFromLocal(cartItems, user.id).then((response) => {
              setCartItems(response.data.cartItemss);
              setCartId(response.data.cartId);
              localStorage.removeItem("cartItems");
              localStorage.setItem('cartId', JSON.stringify({id:response.data.cartId}));
      
            })

           } 
        } else  {
        setCartId(maybeCartId)

          switchCarts(maybeCartId);

        }

    } catch (err) {}
  } 

  const switchCarts = (cid) => {
    switchCart( cid ).then((response) => {

      setCartItems(
        response.data.cartItems)

        setCartId(response.data.cartId)
        // You might receive updated cart data in response, adjust this part accordingly
        // Make sure the API response structure matches your state structure
        // cartId: response.data.cartId, // Update cartId if necessary
    });

  }

  const getProductQty = () => {
    let count = 0;
    cartItems.map((item) => {
      
      if (item.id === product.id) {
        // Ensure the new quantity is a valid number
        count = item.quantity;
      }
    });
    return count;
  };

  const getProductAndReviews = () => {
    // Fetch product data from the server using the product ID
    getProductById(id)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });

    // // Fetch reviews for the product from the server using the product ID
    // getReviewsByProductId(id)
    //   .then(response => {
    //     setReviews(response.data);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching reviews:', error);
    //   });
  };

  const handleAddReview = () => {
    // Add a new review to the server
    // addReview(id, newReview)
    //   .then(() => {
    //     // After adding the review, refresh the reviews
    //     getProductAndReviews();
    //     // Clear the newReview state
    //     setNewReview({
    //       comment: '',
    //       rating: 0,
    //     });
    //   })
    //   .catch(error => {
    //     console.error('Error adding review:', error);
    //   });
  };

  const handleAddToCart = () => {
    const newItem = {
      ...product,
      quantity: isNaN(productQty) || productQty == 0 ? 1 : productQty,
    };

    const user = JSON.parse(localStorage.getItem("user"));
    // If the user is logged in, save the cart data to the database

    try {
      if (user) {
        const userId = user.id;
        addToCart(userId, newItem, cartId)
          .then((response) => {
            // Update state with the new cart products received from the API response

            setCartItems(response.data.cartItems);
            setCartId(response.data.cartId);
            localStorage.setItem("cartId", JSON.stringify({ id: response.data.cartId }));
          })
          .catch((error) => {
            console.error("Error adding product to cart:", error);
          });
      } else {
        // If the user is not logged in, update local state with the new product
        let lcartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        lcartItems.push(newItem);
        localStorage.setItem("cartItems", JSON.stringify(lcartItems));
        setCartItems([...cartItems, newItem]);
      }

      // Call your API endpoint to add the product to the cart in the database
      // Example: insertCartItem(this.state.user.id, newItem);
      // Replace 'insertCartItem' with your actual API function to add cart products
    } catch (error) {
      console.error("Error fetching user carts:", error);
    }
  };

  const handleUpdateQuantity = (newQuantity) => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      console.log("New qty", newQuantity);
      if (user) {
        // If the user is logged in, update the cart items in the database
        updatedCartItemsQuantity(product, cartId, newQuantity)
          .then((response) => {
            console.log(cartItems);
            const updatedCartItems = cartItems.map((item) => {
              if (item.id === product.id) {
                // Ensure the new quantity is a valid number
                const quantity = parseInt(newQuantity);
                setProductQty(quantity);
                
                return { ...item, quantity: isNaN(quantity) ? 0 : quantity };
              }
              return item;
            });
            setCartItems(updatedCartItems);
          })
          .catch((error) => {
            console.error("Error updating cart items in the database:", error);
          });
      } else {
        // If the user is not logged in, update the local state with the new item quantity

        const updatedCartItems = cartItems.map((item) => {
          if (item.id === product.id) {
            // Ensure the new quantity is a valid number
            const quantity = parseInt(newQuantity);
            setProductQty(quantity);

            return { ...item, quantity: isNaN(quantity) ? 0 : quantity };
          }
          return item;
        });
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems)); // Update local storage
        setCartItems(updatedCartItems);
      }
    } catch (error) {
      console.error("Error updating carts:", error);
    }
  };

  const handleRemoveFromCart = () => {
    try {
      updatedCartItemsQuantity(product, cartId, 0).then((response) => {
        console.log(product);
        const updatedCartItems = cartItems.filter(
          (item) => item.id !== product.id
        );
        setCartItems(updatedCartItems);
        console.log(updatedCartItems);
      });
    } catch (error) {}
  };

  const handleQuantityUpdate = (item, newQuantity) => {
    setProductQty(newQuantity);

    handleUpdateQuantity(item);
  };

  return (
    <Container maxWidth="md">
      {product && (
        <Paper style={{ padding: "16px", marginTop: "16px" }}>
          <Typography variant="h4">{product.name}</Typography>
          {product.picture !== null && (
            <img
              src={product.picture}
              alt={product.name}
              style={{ width: "100%", marginTop: "16px" }}
            />
          )}{" "}
          <Typography variant="body1" style={{ marginTop: "16px" }}>
            {product.description}
          </Typography>
          <Typography variant="h5" style={{ marginTop: "8px", color: "blue" }}>
            Price: ${product.price}
          </Typography>
          <Typography variant="body1" style={{ marginTop: "8px" }}>
            Tags: {product.tags}
          </Typography>
          {product.deprecated && (
            <Typography
              variant="body1"
              style={{ marginTop: "8px", color: "red" }}
            >
              This product is deprecated.
            </Typography>
          )}
          {productQty === 0 ? (
            <Button variant="contained" onClick={handleAddToCart}>Add to Cart</Button>
          ) : (
            <>
              <Button onClick={() => handleRemoveFromCart(product)}>
                Remove
              </Button>
              <Button
                onClick={() =>
                  handleQuantityUpdate(parseInt(productQty) + 1)
                }
              >
                <AddIcon />
              </Button>
              {productQty}
              <Button
                onClick={() =>
                  handleQuantityUpdate(
                    Math.max(parseInt(productQty) - 1, 1)
                  )
                }
              >
                <RemoveIcon />
              </Button>
            </>
          )}
        </Paper>
      )}

      <Paper style={{ padding: "16px", marginTop: "16px" }}>
        <Typography variant="h5">Reviews</Typography>
        <List>
          {reviews.map((review) => (
            <ListItem key={review.id}>
              <ListItemText
                primary={review.comment}
                secondary={`Rating: ${review.rating} | Date: ${review.date}`}
              />
            </ListItem>
          ))}
        </List>

        <Typography variant="h6" style={{ marginTop: "16px" }}>
          Add a Review
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Comment"
              fullWidth
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Rating"
              type="number"
              fullWidth
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: e.target.value })
              }
              inputProps={{ min: 0, max: 5 }}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddReview}
          style={{ marginTop: "16px" }}
        >
          Add Review
        </Button>
      </Paper>
    </Container>
  );
};

export default ProductPage;
