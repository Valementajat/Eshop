import React from 'react';
import CardComponent from './CardComponent';
import Product from './Product';

const ProductPage = ({ products, addToCart }) => {
  return (
    <div>
      <h2>Product Listing</h2>
      <CardComponent data={products} addToCart={addToCart} />
      <hr />
      <h2>Add / Edit Product</h2>
      <Product />
    </div>
  );
};

export default ProductPage;
