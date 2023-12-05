// CardComponent.js
import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const CardComponent = ({ data }) => {
  return (
    <Grid container spacing={2}>
      {data.map((product, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2">
                {product.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Description: {product.description}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Tags: {product.tags}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Price: ${product.price}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CardComponent;
