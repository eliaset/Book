import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const app = express();
const port = 3000;

const dbConfig = {
  user: "postgres",
  password: "12345678",
  host: "localhost",
  database: "book",
  port: 5432,
};

const db = new pg.Client(dbConfig);

db.connect((err) => {
  if (err) {
    console.error("connection error", err);
    return;
  }
  console.log("connected");
});

let id = 1;
const data = [
  {
    id: 1,
    title: "The War of Art - By Steven Pressfield",
    author: "Steven Pressfield",
    date_read: "2012-01-05",
    recommendation_score: "10",
    summary: "summary",
    isbn: "0806541229",
    created_at: "2020-01-01",
    updated_at: "2020-01-01",
  },
  {
    id: 2,
    title: "The NEW Book",
    author: "Author2",
    date_read: "2019-11-07",
    recommendation_score: "8",
    summary: "summa",
    isbn: "0307377342",
    created_at: "2020-01-01",
    updated_at: "2020-01-01",
  },
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT *, TO_CHAR(date_read, 'YYYY-MM-DD') AS date_read FROM books"
    );
    res.render("index.ejs", {
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/book", async (req, res) => {
  const bookId = req.query.id;
  console.log(bookId);
  try {
    const result = await db.query(
      "SELECT *, TO_CHAR(date_read, 'YYYY-MM-DD') AS date_read FROM books JOIN notes ON books.id = notes.book_id WHERE books.id = ($1)",
      [bookId]
    );
    res.render("note.ejs", {
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
