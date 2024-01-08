import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  getProductById,
  getReviewsByProductId,
  addReview,
  deleteReview,
} from "../api/Api"; // Import your API functions
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useCart } from '../CartContext';

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
  const { addToCart } = useCart(); 

  const { id } = useParams();
  const [localUser, setLocalUser] = useState(null)
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userLeftReview, setUserLeftReview] = useState(false);
 

  const [newReview, setNewReview] = useState({
    comment: "",
    rating: 0,
  });

useEffect(() => {
  // Fetch product data and reviews from the server using the product ID
  getProductAndReviews();

  // Set local user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  setLocalUser(user);
  
}, [id]);

useEffect(() => {
  if (localUser!==null) {

    // Check if the user left a review for the product
    const userLeftReview = reviews.some((review) => review.user_id === localUser.id);
    setUserLeftReview(userLeftReview);
    }
}, [reviews, localUser]);



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
    getReviewsByProductId(id)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  };

  const handleAddReview = () => {
    console.log("Add reviews");
    // Add a new review to the server
    const user = JSON.parse(localStorage.getItem("user"));

    addReview(product.id, user.id, newReview)
      .then(() => {
        // After adding the review, refresh the reviews
        getProductAndReviews();
        // Clear the newReview state
        setNewReview({
          comment: "",
          rating: 0,
        });
      })
      .catch((error) => {
        console.error("Error adding review:", error);
      });
  };

  const handleAddToCart = () => {
   
    addToCart(product); 
  };

  
  

  const handleRemoveReview = (review_id) => {
    deleteReview(review_id).then((res) => {
      console.log(res);
      window.location.reload()
    })
  }

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
         
            <Button variant="contained" onClick={handleAddToCart}>
              Add to Cart
            </Button>
        </Paper>
      )}

      {reviews && (reviews.length > 0 || localUser) && (
        <Paper style={{ padding: "16px", marginTop: "16px" }}>
          <Typography variant="h5">Reviews</Typography>
          <List>
            {reviews.map((review) => {
              return (
              <ListItem key={review.id}>
                <ListItemText
                  primary={review.comment}
                  secondary={`Rating: ${review.rating} | Date: ${new Date(
                    review.date
                  ).toLocaleDateString()} | By ${review.email}`}
                />
                {localUser && (localUser.role == "admin" || localUser.id === review.user_id) && <Button    variant="contained"
                color="primary"
                onClick={() => handleRemoveReview(review.id)}
                style={{ marginTop: "16px" }}>Remove</Button>}
              </ListItem>
            )})}
          </List>
          { !userLeftReview && localUser &&
            <Paper style={{ padding: "16px", marginTop: "16px" }}>
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
          }
        </Paper>
      )}
    </Container>
  );
};

export default ProductPage;
