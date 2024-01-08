// CardComponent.js
import React from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../CartContext';

const CardComponent = ({ data }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Retrieve addToCart function from useCart hook

  const user = JSON.parse(localStorage.getItem('user'));

  const handleAddToCart = (item) => {
    addToCart(item); // Use addToCart function from useCart hook to add the item to the cart
  };

  const handleEdit = (item) => {
    navigate(`/product/${item.id}`);
    // Implement your edit functionality here
  };

  return (
    <Grid container spacing={2}>
      {data.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardContent>
              <Link to={`/product/${item.id}`}>
                <Typography variant="h6" component="h2">
                  {item.name}
                </Typography>
              </Link>
              <Typography variant="body2" color="textSecondary">
                Description: {item.description}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Tags: {item.tags}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Price: ${item.price}
              </Typography>
              <Button variant="contained" onClick={() => handleAddToCart(item)}>
                Add to Cart
              </Button>
              {/* {user && user.role === 'admin' && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(item)}
                  size="small"
                >
                  Edit
                </Button>
              )} */}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CardComponent;
