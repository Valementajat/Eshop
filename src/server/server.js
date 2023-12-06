const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const emailSender = require('./emailSender');

//example of the mail options 
/* var mailOptions = {
  from: 'noreplyeshop2@gmail.com',
  to: 'eaxample@gmail.com',
  subject: 'Order Confirmation',
  text: 'Thank you for your order! We will notify you once your order is shipped.'
}; 
emailSender.sendEmail(mailOptions);
*/
const app = express();
const jwt_token = 'MyFuckingBestSecretKeyThatIEverInvented822*áýčěšíádhwqěšdhqáí._ˇˇ%ů¨§';

const db = mysql.createPool({
  host: 'mysql_db',
  user: 'MYSQL_USER',
  password: 'MYSQL_PASSWORD',
  database: 'eshop'
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: jwt_token, // secure secret key
    resave: false,
    saveUninitialized: true,
  })
);
// JWT
// Middleware to verify the token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, jwt_token, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// AUTHENTICATION
// Register endpoint
app.post('/user/register', async (req, res) => {
  const { name, surname, email, password } = req.body;

  // Check if the email is already taken
  const [existingUser] = await db.promise().query('SELECT * FROM user WHERE email = ?', [email]);
  if (existingUser.length > 0) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  // Create a new user
  const userVerificationToken = emailSender.newUser();
  await db.promise().query('INSERT INTO user (name, surname, email, password, verification_token) VALUES (?, ?, ?, ?, ?)', [name, surname, email, password, userVerificationToken]);

  // Assuming successful registration, generate a JWT token
  const [newUser] = await db.promise().query('SELECT * FROM user WHERE email = ?', [email]);
  const token = jwt.sign({ id: newUser[0].id, email: newUser[0].email }, jwt_token);

  // Store the token in the session for demonstration purposes (in a real app, you might store it differently)
  req.session.token = token;
  //Send a verification email
  emailSender.sendEmail(emailSender.generateVerificationEmail(newUser[0].email, userVerificationToken));
  res.json({ message: 'Account created successfuly', token, name, surname, email, role:'user', id:newUser[0].id });
});

// Login endpoint
app.post('/user/login', async (req, res) => {
  const { email, password } = req.body;

  // Check for the provided email and password
  const [users] = await db.promise().query('SELECT * FROM user WHERE email = ? AND password = ?', [email, password]);

  if (users.length > 0) {
     if(users[0].activated){
      let user = users[0];
      const token = jwt.sign({ id: user.id, email: user.email }, jwt_token);
      req.session.token = token;
      res.json({ message: 'Login successful', token, name:user.name, surname:user.surname, email:user.email, role:user.role, id:user.id });
    } else {
      res.status(402).json({ message: 'Not_Verified' });
    }
  } else {
    res.status(401).json({ message: 'Login failed' });
  }
});

// Update user endpoint
app.post('/user/verifyEmail', async (req, res) => {
<<<<<<< Updated upstream
  const { email, token } = req.body;

  try {
    // Check if the email and verification token match in the database
    const [users] = await db.promise().query('SELECT * FROM user WHERE email = ? AND verification_token = ?', [email, token]);

=======
  const { params } = req.body;

  try {
    // Check if the email and verification token match in the database
    const [users] = await db.promise().query('SELECT * FROM user WHERE email = ? AND verification_token = ?', [params.email, params.token]);
    console.log(users);
>>>>>>> Stashed changes
    if (users.length > 0) {
      const user = users[0];

      if (user.activated) {
        // If the account is already activated, send back a 401 error
        return res.status(401).json({ message: 'Account already activated' });
      }

      // Update the 'activated' field to true
<<<<<<< Updated upstream
      await db.promise().query('UPDATE user SET activated = ? WHERE email = ?', [true, email]);

      res.json({ message: 'Verification successful' });
    } else {
      res.status(400).json({ message: 'Invalid verification details' });
=======
      await db.promise().query('UPDATE user SET activated = ? WHERE email = ?', [true, params.email]);

      res.json({ message: 'Verification successful' });
    } else {
      res.status(402).json({ message: 'Invalid verification details' });
>>>>>>> Stashed changes
    }
  } catch (error) {
    console.error('Error occurred during verification:', error);
    res.status(500).json({ message: 'Error verifying email' });
  }
});

<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
app.put('/user/update', async (req, res) => {
  const { token, name, surname, email, password } = req.body;

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, jwt_token);
    if (password != "") {
      // Update user information based on the decoded token
      await db.promise().query('UPDATE user SET name = ?, surname = ?, email = ?, password = ? WHERE id = ?', [name, surname, email, password, decodedToken.id]);
    } else {
      await db.promise().query('UPDATE user SET name = ?, surname = ?, email = ? WHERE id = ?', [name, surname, email, decodedToken.id]);

    }
    // Fetch updated user details
    const [updatedUser] = await db.promise().query('SELECT * FROM user WHERE id = ?', [decodedToken.id]);

    res.json({ message: 'User updated successfully', user: updatedUser[0] });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.delete('/user/delete', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];


  try {
    // Verify the token
    const decodedToken = jwt.verify(token, jwt_token);


    // Delete user based on the decoded token
    await db.promise().query('DELETE FROM user WHERE id = ?', [decodedToken.id]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
});
<<<<<<< Updated upstream

// Modify the backend route to retrieve userId from query params
app.get('/user/getUserCarts', async (req, res) => {
  let { userId } = req.query; // Get the userId from query parameter
  
  try {
    // Fetch user carts information using JOIN operation among Cart, CartItem, and product tables
    const [carts] = await db.promise().query('SELECT * FROM Cart WHERE user_id = ?', [userId.userId]);

=======
app.post('/user/addToCart', async (req, res) => {
  const { params } = req.body;
  const item = params.item;
  const userId = params.userId;
  const cartId = params.cartId;
 
  try {
    // Check if the user exists and is activated
    const [users] = await db.promise().query('SELECT * FROM user WHERE id = ?', [userId]);
    if (users.length === 0 || !users[0].activated) {
      return res.status(401).json({ message: 'Invalid user or account not activated' });
    }
    
    // Add the item to the cart
    if ( cartId === 0) {
      // If cartId is null, create a new cart for the user
      const [newCart] = await db.promise().query('INSERT INTO Cart (name, user_id, cost) VALUES (?, ?, ?)', ["NewCart" , userId, 0]);
      const newCartId = newCart.insertId;
      await db.promise().query('INSERT INTO CartItem (cart_ID, product_ID, counts, costs) VALUES (?, ?, ?, ?)', [newCartId, item.id, item.quantity, item.price]);
      const [cartItems] = await db.promise().query(`
        SELECT product.*, CartItem.counts AS quantity
        FROM product
        INNER JOIN CartItem ON product.id = CartItem.product_ID
        WHERE CartItem.cart_ID = ?
      `, [newCartId]);


      return res.json({ message: 'Item added to a new cart successfully', cartId: newCartId, cartItems });
    } else {

      const [existingItem] = await db.promise().query('SELECT * FROM CartItem WHERE cart_ID = ? AND product_ID = ?', [cartId, item.id]);

      if (existingItem.length > 0) {
        await db.promise().query('UPDATE CartItem SET counts = ? WHERE ID = ?', [existingItem[0].counts + 1, existingItem[0].ID]);

      } else {
      // Add the item to the existing cart
      await db.promise().query('INSERT INTO CartItem (cart_ID, product_ID, counts, costs) VALUES (?, ?, ?, ?)', [cartId, item.id, item.quantity, item.price]);
      }
      const [cartItems] = await db.promise().query(`
        SELECT product.*, CartItem.counts AS quantity
        FROM product
        INNER JOIN CartItem ON product.id = CartItem.product_ID
        WHERE CartItem.cart_ID = ?
      `, [cartId]);

      return res.json({ message: 'Item added to the existing cart successfully', cartId, cartItems });
    }
  } catch (error) {
    console.error('Error occurred while adding item to cart:', error);
    return res.status(500).json({ message: 'Error adding item to cart' });
  }
});
app.post('/user/removeCart', async (req, res) => {
  const { params } = req.body;
  const cartId = params.cartId;
  await db.promise().query('DELETE FROM Cart WHERE id = ?', [cartId]);
  return res.json({ message: 'Cart deleted succesfully' });


});

app.post('/user/updatedCartItemsQuantity', async (req, res) => {
  const { params } = req.body;
  const cartId = params.cartId;
  const itemToUpdate = params.itemToUpdate;
  const newQuantity = params.newQuantity;
    try {
      // Check if the new quantity is greater than zero
      if (newQuantity > 0) {
        // If the new quantity is greater than zero, update the quantity
        await db.promise().query('UPDATE CartItem SET counts = ? WHERE cart_ID = ? AND product_ID = ?', [newQuantity, cartId, itemToUpdate.id]);
      } else {
        // If the new quantity is zero or negative, remove the item from the cart
        await db.promise().query('DELETE FROM CartItem WHERE cart_ID = ? AND product_ID = ?', [cartId, itemToUpdate.id]);
      }
  
      return res.json({ message: 'Item added to the existing cart successfully' });
    } catch (error) {
      console.error('Error updating quantity:', error);
      return { success: false, message: 'Error updating quantity' };
    }
  });
  app.post('/user/switchCart', async (req, res) => {
    const { params } = req.body;
    const cartId = params.cartId;
    console.log(params);
      try {
        const [cartItems] = await db.promise().query(`
        SELECT product.*, CartItem.counts AS quantity
        FROM product
        INNER JOIN CartItem ON product.id = CartItem.product_ID
        WHERE CartItem.cart_ID = ?
      `, [cartId]);

      return res.json({ message: 'Cart terrieved Succesfully', cartItems });
      } catch (error) {
        console.error('Error retrieving cart:', error);
        return { success: false, message: 'Error updating quantity' };
      }
    });

// Modify the backend route to retrieve userId from query params
app.get('/user/getUserCarts', async (req, res) => {
  let { userId } = req.query; // Get the userId from query parameter
  
  try {
    // Fetch user carts information using JOIN operation among Cart, CartItem, and product tables
    const [carts] = await db.promise().query('SELECT * FROM Cart WHERE user_id = ?', [userId.userId]);

>>>>>>> Stashed changes
    res.json({  carts }); // Respond with the fetched carts

  } catch (error) {
    console.error('Exception occurred while fetching user carts:', error);
    res.status(501).json({ error: 'Exception occurred while fetching user carts' });
  } 
});
async function verifyAdmin(token) {
  const decodedToken = jwt.verify(token, jwt_token);
  const [users] = await db.promise().query('SELECT * FROM user WHERE id = ?', [decodedToken.id]);
  return users.length > 0;

}


app.get('/admin/getOrderInfo', async (req, res) => {
  let { token, orderId } = req.query; // Get the userId from query parameter
  if (!verifyAdmin(token)) {
    res.status(501).json({error: "Unauthorized"})
    return;
  };
  try {
    // Fetch orders information using JOIN operation among Cart, CartItem, and product tables
    const [orders] = await db.promise().query('SELECT * FROM Orders WHERE ID=?', [orderId]);
    if (orders.length != 1) {
      res.status(501).json({error: "non-valid order number"});
      return;
    }
    let order = orders[0];

    const [orderLinesWithProducts] = await db.promise().query(`
    SELECT OrderLine.*, product.*
    FROM OrderLine
    JOIN product ON OrderLine.product_ID = product.ID
    WHERE OrderLine.order_ID = ?
  `, [order.ID]);
  
    order = {...order, items:orderLinesWithProducts};
    console.log(order)

    res.json({ order }); // Respond with the fetched orders

  } catch (error) {
    console.error('Exception occurred while fetching user orders:', error);
    res.status(501).json({ error: 'Exception occurred while fetching user orders' });
  } 
});


app.get('/admin/getOrderProductsItems', async (req, res) => {
  let { token, orderId } = req.query; // Get the userId from query parameter
  if (!verifyAdmin(token)) {
    res.status(501).json({error: "Unauthorized"})
    return;
  } ;
  try {
    // Fetch orders information using JOIN operation among Cart, CartItem, and product tables
    const [orders] = await db.promise().query('SELECT * FROM Orders WHERE');

    res.json({ orders }); // Respond with the fetched orders

  } catch (error) {
    console.error('Exception occurred while fetching user orders:', error);
    res.status(501).json({ error: 'Exception occurred while fetching user orders' });
  } 
});

app.get('/admin/getAllOrders', async (req, res) => {
  let { token } = req.query; // Get the userId from query parameter
  if (!verifyAdmin(token)) {
    res.status(501).json({error: "Unauthorized"})
    return;
  } ;
  try {
    // Fetch orders information using JOIN operation among Cart, CartItem, and product tables
    const [orders] = await db.promise().query('SELECT * FROM Orders');

    res.json({ orders }); // Respond with the fetched orders

  } catch (error) {
    console.error('Exception occurred while fetching user orders:', error);
    res.status(501).json({ error: 'Exception occurred while fetching user orders' });
  } 
});

app.put('/admin/updateOrderState/:id', (req, res) => {
  const id = req.params.id;
  const state = req.data.orderState;
  const token = req.headers.authorization.split(' ')[1];

  if (!verifyAdmin(token)) {

    res.status(501).send("Unauthorized");
    return
  }

  const updateQuery = 'UPDATE Order SET state = ? WHERE id = ?';
  db.query(updateQuery, [state, id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send('Updated successfully');
    }
  });
});

app.get('/user/createUserOrder', async (req, res) => {
  const { id } = req.query;
 
  

  try {
    // Fetch cart details using the provided cartId
    const [cart] = await db.promise().query('SELECT * FROM Cart WHERE ID = ?', [id.id]);
<<<<<<< Updated upstream
console.log(id.UserId);
=======

>>>>>>> Stashed changes
    // Create a new order based on the fetched cart details
    const [result] = await db
      .promise()
      .query('INSERT INTO Orders (orderDate, state, cost, user_ID) VALUES (NOW(), ?, ?, ?)', [
<<<<<<< Updated upstream
        0,
=======
        "Pending",
>>>>>>> Stashed changes
        cart[0].cost,
        id.UserId,
      ]);

      const orderId = result.insertId; // Newly created order ID

    // Fetch cart items associated with the cartId
    const [cartItems] = await db.promise().query('SELECT * FROM CartItem WHERE cart_ID = ?', [id.id]);

    // Insert each cart item into the OrderLine table
    for (const cartItem of cartItems) {
      await db.promise().query(
        'INSERT INTO OrderLine ( cost, order_ID, product_ID) VALUES (?, ?, ?)',
        [cartItem.costs, orderId, cartItem.product_ID]
      );
    }

    res.json({ orderId });
  } catch (error) {
    console.error('Exception occurred while creating user order:', error);
    res.status(501).json({ error: 'Exception occurred while creating user order' });
  }
});





app.get('/get', (req, res) => { 
  const selectQuery = 'SELECT * FROM product';

  db.query(selectQuery, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});

app.post('/insert', (req, res) => {
  const id = req.body.setBookName;
  const name = req.body.setReview;
  const insertQuery = 'INSERT INTO product (id, name) VALUES (?, ?)';
  db.query(insertQuery, [id, name], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send('Inserted successfully');
    }
  });
});

app.put('/update/:id', (req, res) => {
  const id = req.params.id;
  const updatedReview = req.body.reviewUpdate;

  const updateQuery = 'UPDATE product SET name = ? WHERE id = ?';
  db.query(updateQuery, [updatedReview, id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send('Updated successfully');
    }
  });
});

app.delete('/delete/:Id', (req, res) => {
  const id = req.params.Id;
  const deleteQuery = 'DELETE FROM product WHERE id = ?';
  db.query(deleteQuery, id, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send('Deleted successfully');
    }
  });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
