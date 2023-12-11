import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, getReviewsByProductId, addReview } from '../api/Api'; // Import your API functions

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
} from '@mui/material';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    comment: '',
    rating: 0,
  });

  useEffect(() => {
    // Fetch product data and reviews from the server using the product ID
    getProductAndReviews();
  }, [id]);

  const getProductAndReviews = () => {
    // Fetch product data from the server using the product ID
    // getProductById(id)
    //   .then(response => {
    //     setProduct(response.data);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching product data:', error);
    //   });

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

  return (
    <Container maxWidth="md">
      {product && (
        <Paper style={{ padding: '16px', marginTop: '16px' }}>
          <Typography variant="h4">{product.name}</Typography>
          <img src={product.picture} alt={product.name} style={{ width: '100%', marginTop: '16px' }} />
          <Typography variant="body1" style={{ marginTop: '16px' }}>
            {product.description}
          </Typography>
          <Typography variant="body1" style={{ marginTop: '8px' }}>
            Price: ${product.price}
          </Typography>
          <Typography variant="body1" style={{ marginTop: '8px' }}>
            Tags: {product.tags}
          </Typography>
          {product.deprecated && (
            <Typography variant="body1" style={{ marginTop: '8px', color: 'red' }}>
              This product is deprecated.
            </Typography>
          )}
        </Paper>
      )}

      <Paper style={{ padding: '16px', marginTop: '16px' }}>
        <Typography variant="h5">Reviews</Typography>
        <List>
          {reviews.map(review => (
            <ListItem key={review.id}>
              <ListItemText
                primary={review.comment}
                secondary={`Rating: ${review.rating} | Date: ${review.date}`}
              />
            </ListItem>
          ))}
        </List>

        <Typography variant="h6" style={{ marginTop: '16px' }}>
          Add a Review
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Comment"
              fullWidth
              value={newReview.comment}
              onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Rating"
              type="number"
              fullWidth
              value={newReview.rating}
              onChange={e => setNewReview({ ...newReview, rating: e.target.value })}
              inputProps={{ min: 0, max: 5 }}
            />
          </Grid>
        </Grid>
        <Button variant="contained" color="primary" onClick={handleAddReview} style={{ marginTop: '16px' }}>
          Add Review
        </Button>
      </Paper>
    </Container>
  );
};

export default ProductPage;
