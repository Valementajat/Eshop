const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const session = require("express-session");

const emailSender = require("./emailSender");

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
const jwt_token =
  "MyFuckingBestSecretKeyThatIEverInvented822*áýčěšíádhwqěšdhqáí._ˇˇ%ů¨§";

const db = mysql.createPool({
  host: "mysql_db",
  user: "MYSQL_USER",
  password: "MYSQL_PASSWORD",
  database: "eshop",
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
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, jwt_token, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// AUTHENTICATION
// Register endpoint
app.post("/user/register", async (req, res) => {
  const { name, surname, email, password } = req.body;

  // Check if the email is already taken
  const [existingUser] = await db
    .promise()
    .query("SELECT * FROM user WHERE email = ?", [email]);
  if (existingUser.length > 0) {
    return res
      .status(400)
      .json({ message: "User with this email already exists" });
  }

  // Create a new user
  const userVerificationToken = emailSender.newUser();
  await db
    .promise()
    .query(
      "INSERT INTO user (name, surname, email, password, verification_token) VALUES (?, ?, ?, ?, ?)",
      [name, surname, email, password, userVerificationToken]
    );

  // Assuming successful registration, generate a JWT token
  const [newUser] = await db
    .promise()
    .query("SELECT * FROM user WHERE email = ?", [email]);
  const token = jwt.sign(
    { id: newUser[0].id, email: newUser[0].email },
    jwt_token
  );

  // Store the token in the session for demonstration purposes (in a real app, you might store it differently)
  req.session.token = token;
  //Send a verification email
  emailSender.sendEmail(
    emailSender.generateVerificationEmail(
      newUser[0].email,
      userVerificationToken
    )
  );
  res.json({
    message: "Account created successfuly",
    token,
    name,
    surname,
    email,
    role: "user",
    id: newUser[0].id,
  });
});

// Login endpoint
app.post("/user/login", async (req, res) => {
  const { email, password } = req.body;

  // Check for the provided email and password
  const [users] = await db
    .promise()
    .query("SELECT * FROM user WHERE email = ? AND password = ?", [
      email,
      password,
    ]);

  if (users.length > 0) {
    if (users[0].activated) {
      let user = users[0];
      const token = jwt.sign({ id: user.id, email: user.email }, jwt_token);
      req.session.token = token;
      res.json({
        message: "Login successful",
        token,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        id: user.id,
      });
    } else {
      res.status(402).json({ message: "Not_Verified" });
    }
  } else {
    res.status(401).json({ message: "Login failed" });
  }
});

// Update user endpoint
// app.put('/user/update', async (req, res) => {

//   const { params } = req.body;

//   try {
//     // Check if the email and verification token match in the database
//     const [users] = await db.promise().query('SELECT * FROM user WHERE email = ? AND verification_token = ?', [params.email, params.token]);
//     console.log(users);
//     if (users.length > 0) {
//       const user = users[0];

//       if (user.activated) {
//         // If the account is already activated, send back a 401 error
//         return res.status(401).json({ message: "Account already activated" });
//       }

//       // Update the 'activated' field to true
//       res.status(400).json({ message: 'Invalid verification details' });
//       await db.promise().query('UPDATE user SET activated = ? WHERE email = ?', [true, params.email]);

//       res.json({ message: 'Verification successful' });
//     } else {
//       res.status(402).json({ message: 'Invalid verification details' });
//     }
//   } catch (error) {
//     console.error("Error occurred during verification:", error);
//     res.status(500).json({ message: "Error verifying email" });
//   }
// });



app.put('/user/update', async (req, res) => {
  const { token, name, surname, email, password } = req.body;

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, jwt_token);
    if (password != "") {
      // Update user information based on the decoded token
      await db
        .promise()
        .query(
          "UPDATE user SET name = ?, surname = ?, email = ?, password = ? WHERE id = ?",
          [name, surname, email, password, decodedToken.id]
        );
    } else {
      await db
        .promise()
        .query(
          "UPDATE user SET name = ?, surname = ?, email = ? WHERE id = ?",
          [name, surname, email, decodedToken.id]
        );
    }
    // Fetch updated user details
    const [updatedUser] = await db
      .promise()
      .query("SELECT * FROM user WHERE id = ?", [decodedToken.id]);

    res.json({ message: "User updated successfully", user: updatedUser[0] });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

app.delete("/user/delete", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, jwt_token);

    // Delete user based on the decoded token
    await db
      .promise()
      .query("DELETE FROM user WHERE id = ?", [decodedToken.id]);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
});

// Modify the backend route to retrieve userId from query params
app.get('/user/getUserCarts', async (req, res) => {
  let { userId } = req.query; // Get the userId from query parameter

  try {
    // Fetch user carts information using JOIN operation among cart, cart_item, and product tables
    const [carts] = await db
      .promise()
      .query("SELECT * FROM cart WHERE user_id = ?", [userId.userId]);

    res.json({ carts }); // Respond with the fetched carts
  } catch (error) {
    console.error("Exception occurred while fetching user carts:", error);
    res
      .status(501)
      .json({ error: "Exception occurred while fetching user carts" });
  }
});
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
      const [newCart] = await db.promise().query('INSERT INTO cart (name, user_id, cost) VALUES (?, ?, ?)', ["NewCart" , userId, 0]);
      const newCartId = newCart.insertId;
      await db.promise().query('INSERT INTO cart_item (cart_id, product_id, counts, cost) VALUES (?, ?, ?, ?)', [newCartId, item.id, item.quantity, item.price]);
      const [cartItems] = await db.promise().query(`
        SELECT product.*, cart_item.counts AS quantity
        FROM product
        INNER JOIN cart_item ON product.id = cart_item.product_id
        WHERE cart_item.cart_id = ?
      `, [newCartId]);


      return res.json({ message: 'Item added to a new cart successfully', cartId: newCartId, cartItems });
    } else {

      const [existingItem] = await db.promise().query('SELECT * FROM cart_item WHERE cart_id = ? AND product_id = ?', [cartId, item.id]);

      if (existingItem.length > 0) {
        await db.promise().query('UPDATE cart_item SET counts = ? WHERE id = ?', [existingItem[0].counts + 1, existingItem[0].id]);

      } else {
      // Add the item to the existing cart
      await db.promise().query('INSERT INTO cart_item (cart_id, product_id, counts, cost) VALUES (?, ?, ?, ?)', [cartId, item.id, item.quantity, item.price]);
      }
      const [cartItems] = await db.promise().query(`
        SELECT product.*, cart_item.counts AS quantity
        FROM product
        INNER JOIN cart_item ON product.id = cart_item.product_id
        WHERE cart_item.cart_id = ?
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
  await db.promise().query('DELETE FROM cart WHERE id = ?', [cartId]);
  return res.json({ message: 'cart deleted succesfully' });


});
app.post('/user/createCartFromLocal', async (req, res) => {
  try {
    const { params } = req.body;
    const userId = params.userId;
    const items = params.items;

    // Create a new cart first and get the cart id
    const [newCart] = await db.promise().query('INSERT INTO cart (name, user_id, cost) VALUES (?, ?, ?)', ["NewCart", userId, 0]);
    const cartId = newCart.insertId;
    console.log(cartId);

    // Perform operations to add items to the cart in the database
    // Assuming 'CartItems' table has columns: id (auto-increment), cart_id, product_id, quantity, cost

    // Insert items into the 'CartItems' table using the obtained cartId
    for (const item of items) {
      const { id, quantity, price } = item;

      // Perform an insert query to add each item into the 'CartItems' table
      await db.promise().query(
        'INSERT INTO cart_item (cart_id, product_id, counts, cost) VALUES (?, ?, ?, ?)',
        [cartId, id, quantity, price * quantity] // Calculate cost based on quantity and price
      );
    }

    // Calculate the total cost for the items in the cart
    const [cartItems] = await db.promise().query('SELECT * FROM cart_item WHERE cart_id = ?', [cartId]);
    const totalCost = cartItems.reduce((total, item) => total + parseFloat(item.cost), 0);

    // Update the total cost in the cart table
    await db.promise().query('UPDATE cart SET cost = ? WHERE id = ?', [totalCost.toFixed(2), cartId]);
    const [cartItemss] = await db.promise().query(`
    SELECT product.*, cart_item.counts AS quantity
    FROM product
    INNER JOIN cart_item ON product.id = cart_item.product_id
    WHERE cart_item.cart_id = ?
  `, [cartId]);
    // Respond with a success message and the cartId if successful
    return res.status(200).json({ success: true, message: 'cart created and items added successfully', cartId, cartItemss });
  } catch (error) {
    console.error('Error creating cart from local storage:', error);
    return res.status(500).json({ success: false, message: 'Error creating cart from local storage' });
  }
});

app.post('/user/updatedCartItemsQuantity', async (req, res) => {
  const { params } = req.body;
  const cartId = params.cartId;
  const itemToUpdate = params.itemToUpdate;
  const newQuantity = params.newQuantity;

  try {
    let newTotalCost = 0;

    // Check if the new quantity is greater than zero
    if (newQuantity > 0) {
      // If the new quantity is greater than zero, calculate the new price
      const itemPrice = parseFloat(itemToUpdate.price); // Convert price to a floating-point number
      const newPrice = (itemPrice * newQuantity).toFixed(2);

      // Update the quantity and cost with the new values
      await db.promise().query('UPDATE cart_item SET counts = ?, cost = ? WHERE cart_id = ? AND product_id = ?', [newQuantity, newPrice, cartId, itemToUpdate.id]);

      // Calculate the new total cost after updating the item quantity and cost
      const [cartItems] = await db.promise().query('SELECT * FROM cart_item WHERE cart_id = ?', [cartId]);
      newTotalCost = cartItems.reduce((total, item) => total + parseFloat(item.cost), 0); // Calculate the sum of cost of all items
    } else {
      // If the new quantity is zero or negative, remove the item from the cart
      await db.promise().query('DELETE FROM cart_item WHERE cart_id = ? AND product_id = ?', [cartId, itemToUpdate.id]);

      // Calculate the new total cost after removing the item
      const [cartItems] = await db.promise().query('SELECT * FROM cart_item WHERE cart_id = ?', [cartId]);
      newTotalCost = cartItems.reduce((total, item) => total + parseFloat(item.cost), 0); // Calculate the sum of cost of all items
    }

    // Update the total cost in the cart table
    await db.promise().query('UPDATE cart SET cost = ? WHERE id = ?', [newTotalCost.toFixed(2), cartId]);

    return res.json({ message: 'Item updated in the cart successfully', newTotalCost });
  } catch (error) {
    console.error('Error updating quantity:', error);
    return res.status(500).json({ success: false, message: 'Error updating quantity' });
  }
});

  app.post('/user/switchCart', async (req, res) => {
    const { params } = req.body;
    const cartId = params.cartId;
      try {
        const [cartItems] = await db.promise().query(`
        SELECT product.*, cart_item.counts AS quantity
        FROM product
        INNER JOIN cart_item ON product.id = cart_item.product_id
        WHERE cart_item.cart_id = ?
      `, [cartId]);

      return res.json({ message: 'cart terrieved Succesfully', cartItems, cartId });
      } catch (error) {
        console.error('Error retrieving cart:', error);
        return { success: false, message: 'Error updating quantity' };
      }
    });


// Modify the backend route to retrieve userId from query params
app.get("/user/getUserOrders", async (req, res) => {
  let { userId } = req.query; // Get the userId from query parameter

  try {
    // Fetch user carts information using JOIN operation among cart, cart_item, and product tables
    const [orders] = await db
      .promise()
      .query("SELECT * FROM `order` WHERE user_id = ?", [userId.userId]);

    res.json({ orders }); // Respond with the fetched orders
  } catch (error) {
    console.error("Exception occurred while fetching user orders:", error);
    res
      .status(501)
      .json({ error: "Exception occurred while fetching user orders" });
  }
});


async function verifyAdmin(token) {
  const decodedToken = jwt.verify(token, jwt_token);
  const [users] = await db
    .promise()
    .query("SELECT * FROM user WHERE id = ?", [decodedToken.id]);
  return users.length > 0;
}

// Modify the backend route to retrieve userId and cartId from query params
app.get("/user/getCartDetails", async (req, res) => {
  let { userId, cartId } = req.query; // Get the userId and cartId from query parameters

  try {
    // Fetch details of a specific cart using JOIN operation among cart, cart_item, and product tables
    const [cartDetails] = await db.promise().query(
      `SELECT * FROM cart WHERE cart.user_id = ? AND cart.id = ?;`,
      [userId, cartId]
    );
    const [cartProducts] = await db.promise().query(
      `SELECT
      cart.*,
      cart_item.*,
      product.*
  FROM
      cart 
  JOIN
      cart_item ON cart.user_id = ? AND cart.id = ? AND cart_item.cart_id = ?
  JOIN
      product ON cart_item.product_id = product.id
  WHERE 
      cart.user_id = ? AND cart.id = ?;
  `,
      [userId, cartId, cartId, userId, cartId]
    );
    res.json({ cartDetails:cartDetails[0], cartProducts }); // Respond with the fetched cart details
  
  } catch (error) {
    console.error("Exception occurred while fetching cart details:", error);
    res
      .status(501)
      .json({ error: "Exception occurred while fetching cart details" });
  }
});

// The verifyAdmin function remains unchanged
async function verifyAdmin(token) {
  const decodedToken = jwt.verify(token, jwt_token);
  const [users] = await db
    .promise()
    .query("SELECT * FROM user WHERE id = ?", [decodedToken.id]);
  return users.length > 0;
}

app.get("/admin/getOrderInfo", async (req, res) => {
  let { token, orderId } = req.query; // Get the userId from query parameter
  if (!verifyAdmin(token)) {
    res.status(501).json({ error: "Unauthorized" });
    return;
  }
  try {
    // Fetch orders information using JOIN operation among cart, cart_item, and product tables
    const [orders] = await db
      .promise()
      .query("SELECT * FROM `order` WHERE id=?", [orderId]);
    if (orders.length != 1) {
      res.status(501).json({ error: "non-valid `order` number" });
      return;
    }
    let order = orders[0];

    const [orderLinesWithProducts] = await db.promise().query(
      `
    SELECT order_line.*, product.*
    FROM order_line
    JOIN product ON order_line.product_id = product.id
    WHERE order_line.order_id = ?
  `,
      [order.id]
    );

    order = { ...order, items: orderLinesWithProducts };

    res.json({ order }); // Respond with the fetched orders
  } catch (error) {
    console.error("Exception occurred while fetching user orders:", error);
    res
      .status(501)
      .json({ error: "Exception occurred while fetching user orders" });
  }
});
app.post('/user/getRecommendationsByTag', async (req, res) => {
  try {
    const { params } = req.body;
    const tags = params.tags;
   
// Step 1: Search user's most demanding tags (in order)


 // Get all tags into a single array

const recommendedProducts = [];
const uniqueProducts = new Set(); // Use a Set to maintain unique product IDs
 // Define the weights for average rating and review count
 const ratingWeight = 0.7; // Weight for average rating
 const reviewCountWeight = 0.3; // Weight for review count
// Step 2: For each tag, split and count occurrences, then fetch recommendations

for (const tag of tags) {
  const trimmedTag = tag.trim(); // Split tags into an array
 

    // Using the recommendation by tag endpoint for each tag
    const [productsByTag] = await db.promise().query(`
      SELECT product.*, AVG(feedback.rating) AS average_rating, COUNT(feedback.id) AS review_count
      FROM product
      LEFT JOIN feedback ON product.id = feedback.product_id
      WHERE FIND_IN_SET(?, product.tags) > 0
      GROUP BY product.id
    `, [trimmedTag]); // Use the trimmed tag



    productsByTag.forEach(product => {
      if (!uniqueProducts.has(product.id)) { // Check if product ID is not already added
        product.weightedScore = (product.average_rating * ratingWeight) + (product.review_count * reviewCountWeight);
        recommendedProducts.push(product);
        uniqueProducts.add(product.id); // Add product ID to the Set to track uniqueness
      }
    });
}

// Sort the recommendations by weighted score and limit to top 10
const sortedRecommendedProducts = recommendedProducts
  .sort((a, b) => b.weightedScore - a.weightedScore)
  .slice(0, 5);

// Send the sorted recommended products as a response
return res.json({ message: 'Recommended products retrieved successfully', recommendedProducts: sortedRecommendedProducts });
} catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error retrieving recommendations', error: error.message });
  }
});


  

app.post('/user/getRecommendationsWithoutTags', async (req, res) => {
  try {
    const { params } = req.body;
    const userId = params.userId;

// Step 1: Search user's most demanding tags (in order)
 const [userTagsRows] = await db.promise().query(`
      SELECT product.tags
      FROM product
      INNER JOIN feedback ON product.id = feedback.product_id
      WHERE feedback.user_id = ?
      GROUP BY product.tags
      ORDER BY COUNT(*) DESC
    `, [userId]);

    const userTags = userTagsRows.map(row => row.tags).join(',').split(','); // Get all tags into a single array
const recommendedProducts = [];
const uniqueProducts = new Set(); // Use a Set to maintain unique product IDs
 // Define the weights for average rating and review count
 const ratingWeight = 0.7; // Weight for average rating
 const reviewCountWeight = 0.3; // Weight for review count
// Step 2: For each tag, split and count occurrences, then fetch recommendations

for (const tag of userTags) {
  const trimmedTag = tag.trim(); // Split tags into an array
 
    // Using the recommendation by tag endpoint for each tag
    const [productsByTag] = await db.promise().query(`
      SELECT product.*, AVG(feedback.rating) AS average_rating, COUNT(feedback.id) AS review_count
      FROM product
      LEFT JOIN feedback ON product.id = feedback.product_id
      WHERE FIND_IN_SET(?, product.tags) > 0
      GROUP BY product.id
    `, [trimmedTag]); // Use the trimmed tag


    productsByTag.forEach(product => {
      if (!uniqueProducts.has(product.id)) { // Check if product ID is not already added
        product.weightedScore = (product.average_rating * ratingWeight) + (product.review_count * reviewCountWeight);
        recommendedProducts.push(product);
        uniqueProducts.add(product.id); // Add product ID to the Set to track uniqueness
      }
    });
}

// Sort the recommendations by weighted score and limit to top 10
const sortedRecommendedProducts = recommendedProducts
  .sort((a, b) => b.weightedScore - a.weightedScore)
  .slice(0, 5);
console.log(sortedRecommendedProducts);
// Send the sorted recommended products as a response
return res.json({ message: 'Recommended products retrieved successfully', recommendedProducts: sortedRecommendedProducts });
} catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error retrieving recommendations', error: error.message });
  }
});


app.get("/admin/getOrderProductsItems", async (req, res) => {
  let { token, orderId } = req.query; // Get the userId from query parameter
  if (!verifyAdmin(token)) {
    res.status(501).json({ error: "Unauthorized" });
    return;
  }
  try {
    // Fetch orders information using JOIN operation among cart, cart_item, and product tables
    const [orders] = await db.promise().query("SELECT * FROM `order` WHERE");

    res.json({ orders }); // Respond with the fetched orders
  } catch (error) {
    console.error("Exception occurred while fetching user orders:", error);
    res
      .status(501)
      .json({ error: "Exception occurred while fetching user orders" });
  }
});

app.get("/admin/getAllOrders", async (req, res) => {
  let { token } = req.query; // Get the userId from query parameter
  if (!verifyAdmin(token)) {
    res.status(501).json({ error: "Unauthorized" });
    return;
  }
  try {
    // Fetch orders information using JOIN operation among cart, cart_item, and product tables
    const [orders] = await db.promise().query("SELECT * FROM `order`");

    res.json({ orders }); // Respond with the fetched orders
  } catch (error) {
    console.error("Exception occurred while fetching user orders:", error);
    res
      .status(501)
      .json({ error: "Exception occurred while fetching user orders" });
  }
});

app.put("/admin/updateOrderState/:id", (req, res) => {
  const id = req.params.id;
  const state = req.body.state;
  const token = req.headers.authorization.split(" ")[1];

  if (!verifyAdmin(token)) {
    res.status(501).send("Unauthorized");
    return;
  }

  const updateQuery = "UPDATE `order` SET state = ? WHERE id = ?";
  db.query(updateQuery, [state, id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send("Updated successfully");
    }
  });
});

app.post("/user/createUserOrder", async (req, res) => {
  const { params } = req.body;
 
  const cartId = params.id;
  const UserId = params.userId;

  try {
    // Fetch cart details using the provided cartId
    const [cart] = await db
      .promise()
      .query("SELECT * FROM cart WHERE id = ?", [cartId]);
    // Create a new order based on the fetched cart details
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO `order` (orderDate, state, cost, user_id) VALUES (NOW(), ?, ?, ?)",
        ["Pending", cart[0].cost, UserId]
      );

    const orderId = result.insertId; // Newly created order id

    // Fetch cart items associated with the cartId
    const [cartItems] = await db
      .promise()
      .query("SELECT * FROM cart_item WHERE cart_id = ?", [cartId]);

    // Insert each cart item into the order_line table
    for (const cartItem of cartItems) {
      await db
        .promise()
        .query(
          "INSERT INTO order_line ( cost, order_id, product_id) VALUES (?, ?, ?)",
          [cartItem.cost, orderId, cartItem.product_id]
        );
    }

    res.json({ orderId });
  } catch (error) {
    console.error("Exception occurred while creating user order:", error);
    res
      .status(501)
      .json({ error: "Exception occurred while creating user order" });
  }
});

app.get("/get", (req, res) => {
  const selectQuery = "SELECT * FROM product";

  db.query(selectQuery, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/insert", (req, res) => {
  const id = req.body.setBookName;
  const name = req.body.setReview;
  const insertQuery = "INSERT INTO product (id, name) VALUES (?, ?)";
  db.query(insertQuery, [id, name], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send("Inserted successfully");
    }
  });
});

app.put("/update/:id", (req, res) => {
  const id = req.params.id;
  const updatedReview = req.body.reviewUpdate;

  const updateQuery = "UPDATE product SET name = ? WHERE id = ?";
  db.query(updateQuery, [updatedReview, id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send("Updated successfully");
    }
  });
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  const deleteQuery = "DELETE FROM product WHERE id = ?";
  db.query(deleteQuery, id, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send("Deleted successfully");
    }
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

// TODO start here
app.get("/product/details/:id", async (req, res) => {

  const id = req.params.id;

  try {
    // Fetch products information using JOIN operation among cart, cart_item, and product tables
    const [products] = await db
      .promise()
      .query("SELECT * FROM `product` WHERE id=?", [id]);
    if (products.length != 1) {
      res.status(501).json({ error: "non-valid `product` number" });
      return;
    }
    let product = products[0];

  //   const [productLinesWithProducts] = await db.promise().query(
  //     `
  //   SELECT product_line.*, product.*
  //   FROM product_line
  //   JOIN product ON product_line.product_id = product.id
  //   WHERE product_line.product_id = ?
  // `,
  //     [product.id]
  //   );

  //   product = { ...product, items: productLinesWithProducts };
  //   console.log(product);

    res.json(product); // Respond with the fetched products
  } catch (error) {
    console.error("Exception occurred while fetching user products:", error);
    res
      .status(501)
      .json({ error: "Exception occurred while fetching user products" });
  }

})



app.post("/feedback/add", (req, res) => {
  const data = req.body.params
  console.log(data);

  const product_id = data.productId;
  const {comment, rating} = data.review;
  const user_id = data.userId;
  const insertQuery = `
  INSERT INTO feedback 
  (\`date\`, comment, rating, user_id, product_id) 
  VALUES (NOW(), ?, ?, ?, ?);
  `
  db.query(insertQuery, [comment, parseFloat(rating), user_id, product_id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send("Inserted successfully");
    }
  });
});

app.get("/feedback/get/user/:id", (req, res) => {

  const id = req.params.id;

  const fetchQuery = `
  SELECTS * FROM feedback WHERE user_id = ?;
  `
  db.query(fetchQuery, [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/feedback/get/product/:id", (req, res) => {

  const id = req.params.id;

  const fetchQuery = `
  SELECT
    f.id,
    f.comment,
    f.rating,
    u.id AS user_id,
    u.email
FROM
    feedback f
JOIN
    user u ON f.user_id = u.id 
WHERE
    f.product_id = ?;
  `
  db.query(fetchQuery, [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(result);

    }
  });
});

app.get("/feedback/get/:product_id/:user_id", (req, res) => {

  const product_id = req.params.product_id;
  const user_id = req.params.user_id;

  const fetchQuery = `
  SELECT * FROM feedback WHERE (product_id, user_id) = (?, ?);
  `
  db.query(fetchQuery, [product_id, user_id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(result);

    }
  });
});


app.delete("/feedback/delete/:id", (req, res) => {
  const id = req.params.id;
  const deleteQuery = "DELETE FROM feedback WHERE id = ?";
  db.query(deleteQuery, id, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send("Deleted successfully");
    }
  });
});