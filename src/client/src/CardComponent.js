import React from 'react';
import { Card, Button } from 'react-bootstrap';

const CardComponent = ({ data, handleChange2, edit, remove }) => {
  return data.map((val, key) => (
    <React.Fragment key={key}>
      <Card style={{ width: '18rem' }} className='m-2'>
        <Card.Body>
          <Card.Title>{val.book_name}</Card.Title>
          <Card.Text>{val.book_review}</Card.Text>
          <input name='reviewUpdate' onChange={handleChange2} placeholder='Update Review' />
          <Button className='m-2' onClick={() => edit(val.id)}>Update</Button>
          <Button onClick={() => remove(val.id)}>Delete</Button>
        </Card.Body>
      </Card>
      <h1>töis mutten duunissa</h1>
    </React.Fragment>
  ));
};

export default CardComponent;
