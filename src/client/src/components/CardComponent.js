// CardComponent.js
import React from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';

const CardComponent = ({ data, addToCart }) => {
  const handleAddToCart = (item) => {
  addToCart(item);/// Call the function to add item to the cart
  };
  return (
    <Grid container spacing={2}>
      {data.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2">
                {item.name}
              </Typography> 
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
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CardComponent;
