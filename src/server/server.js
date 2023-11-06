const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

const db = mysql.createPool({
  host: 'mysql_db',
  user: 'MYSQL_USER',
  password: 'MYSQL_PASSWORD',
  database: 'eshop'
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
