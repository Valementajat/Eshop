import React from 'react';
import { Card, Button } from 'react-bootstrap';

const CartComponent = ({ data, createOrder }) => {

  return  data.map((val, key) => (
        <React.Fragment key={key}>
          <Card key={key} style={{ width: '18rem' }} className='m-2'>
            <Card.Body>
              <Card.Title>{val.id}</Card.Title>
              <Card.Text>{val.name}</Card.Text>
              <Button onClick={() => createOrder(val.id)}>Create Order</Button>
            </Card.Body>
          </Card>
        </React.Fragment>
      ));
};

export default CartComponent;
