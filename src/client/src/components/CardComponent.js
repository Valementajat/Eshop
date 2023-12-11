// CardComponent.js
import React from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; // Import EditIcon from Material-UI
import { useNavigate, Link } from 'react-router-dom';


const CardComponent = ({ data, addToCart }) => {
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
  addToCart(item);/// Call the function to add item to the cart
  };
  const user = JSON.parse(localStorage.getItem('user'));
  const handleEdit = (item) => {
    // Logic for handling edit action for the item
    navigate(`/product/${item.name}`);
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
              {user && user.role === 'admin' && (
                // Show edit button only if user role is admin
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />} // Replace with your edit icon component
                  onClick={() => handleEdit(item)}
                  size="small"
                >
                  Edit
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CardComponent;
