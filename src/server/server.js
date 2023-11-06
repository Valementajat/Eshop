const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const session = require('express-session');

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
  await db.promise().query('INSERT INTO user (name, surname, email, password) VALUES (?, ?, ?, ?)', [name, surname, email, password]);

  // Assuming successful registration, generate a JWT token
  const [newUser] = await db.promise().query('SELECT * FROM user WHERE email = ?', [email]);
  const token = jwt.sign({ id: newUser[0].id, email: newUser[0].email }, jwt_token);

  // Store the token in the session for demonstration purposes (in a real app, you might store it differently)
  req.session.token = token;

  res.json({ message: 'Account created successfuly', token, name, email });
});

// Login endpoint
app.post('/user/login', async (req, res) => {
  const { email, password } = req.body;

  // Check for the provided email and password
  const [users] = await db.promise().query('SELECT * FROM user WHERE email = ? AND password = ?', [email, password]);

  if (users.length > 0) {
    let user = users[0];
    const token = jwt.sign({ id: user.id, email: user.email }, jwt_token);
    req.session.token = token;

    res.json({ message: 'Login successful', token, name:user.name, surname:user.surname, email:user.email });
  } else {
    res.status(401).json({ message: 'Login failed' });
  }
});

app.get('/', (req, res) => {
  res.send('Hi There');
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
      console.log(result);
      res.status(200).send('Inserted successfully');
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
