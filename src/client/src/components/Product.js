import React, { useState } from 'react';
import { Container, Divider, TextField, Button } from '@mui/material';
import "../css/style.css";

const Product = ({ product }) => {
  const [productName, setProductName] = useState(product ? product.name : '');
  const [productDescription, setProductDescription] = useState(product ? product.description : '');
  const [productPicture, setProductPicture] = useState(product ? product.picture : '');
  const [productTags, setProductTags] = useState(product ? product.tags : '');
  const [productDeprecated, setProductDeprecated] = useState(product ? product.deprecated : '');
  const [productPrice, setProductPrice] = useState(product ? product.price : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (create/update product)
    const newProduct = {
      name: productName,
      description: productDescription,
      picture: productPicture,
      tags: productTags,
      deprecated: productDeprecated,
      price: productPrice,
    };
    console.log(newProduct); // This will log the product data, modify it to send to backend API
  };

  return (
    <Container>
      <Divider />
      <form onSubmit={handleSubmit}>
        <TextField
          label="Product Name"
          variant="outlined"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Product Description"
          variant="outlined"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <TextField
          label="Product Picture"
          variant="outlined"
          value={productPicture}
          onChange={(e) => setProductPicture(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Product Tags"
          variant="outlined"
          value={productTags}
          onChange={(e) => setProductTags(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Deprecated"
          variant="outlined"
          value={productDeprecated}
          onChange={(e) => setProductDeprecated(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Product Price"
          variant="outlined"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          fullWidth
          margin="normal"
        />
       
        <Button type="submit" variant="contained" color="primary">
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </form>
    </Container>
  );
};

export default Product;
