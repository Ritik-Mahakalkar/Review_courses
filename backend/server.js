const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',         
  password: '123456789',        
  database: 'course_db' 
});

db.connect((err) => {
  if (err) {
    console.error('DB connection error:', err);
  } else {
    console.log('Connected to MySQL');
  }
});


db.query(`
  CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    userId BIGINT,
    courseId BIGINT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment VARCHAR(300),
    createdAt DATETIME DEFAULT NOW()
  )
`);


app.post('/api/reviews', (req, res) => {
  const { userId, courseId, rating, comment } = req.body;

  if (!userId || !courseId || !rating || !comment) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  const sql = `
    INSERT INTO reviews (userId, courseId, rating, comment)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [userId, courseId, rating, comment], (err, result) => {
    if (err) return res.status(500).json({ msg: 'DB error', error: err });
    res.status(201).json({ msg: 'Review added successfully' });
  });
});


app.get('/api/reviews/course/:courseId', (req, res) => {
  const courseId = req.params.courseId;
  const sql = `
    SELECT * FROM reviews
    WHERE courseId = ?
    ORDER BY createdAt DESC
  `;
  db.query(sql, [courseId], (err, results) => {
    if (err) return res.status(500).json({ msg: 'DB error', error: err });
    res.json(results);
  });
});


app.get('/api/reviews/average/:courseId', (req, res) => {
  const courseId = req.params.courseId;
  const sql = `
    SELECT AVG(rating) as average
    FROM reviews
    WHERE courseId = ?
  `;
  db.query(sql, [courseId], (err, result) => {
    if (err) return res.status(500).json({ msg: 'DB error', error: err });
    res.json(result[0]);
  });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
