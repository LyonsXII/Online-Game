import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 5000;
env.config();

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Song_Data",
  password: process.env.Database_Password,
  port: 5432
  });

db.connect();

app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/numQuestions", async (req, res) => {
  const difficulty = req.body.difficulty;
  const category = req.body.category;
  const numQuestions = await db.query("SELECT COUNT(id) FROM songs WHERE difficulty = $1 AND category = $2", [difficulty, category]);
  res.json(numQuestions.rows);
});

app.post("/choices", async (req, res) => {
  const difficulty = req.body.difficulty;
  const category = req.body.category;
  let excluded = req.body.excluded[0] != null ? req.body.excluded : [];
  const excludedString = excluded.length > 0 ? excluded.join(',') : undefined;
  let choices = {};

  // Pulling four random choices from database, excluding previous answers
  try {
    let query = `
      SELECT id, property 
      FROM songs 
      WHERE difficulty = $1 
      AND category = $2 
    `;

    if (excludedString != undefined && excluded.length > 0) {
      query += `AND id NOT IN (${excluded.map((_, index) => '$' + (index + 3)).join(',')})`;
    }

    query += `
      ORDER BY RANDOM() 
      LIMIT 4`;

    const params = [difficulty, category, ...excluded];
    choices = await db.query(query, params);
    choices = choices.rows;

  } catch(err) {
    console.log(err);
  }

  // Pulling expanded data for correct choice
  try {
    choices[0] = await db.query("SELECT * FROM songs WHERE id=$1", [choices[0].id]);
    choices[0] = choices[0].rows[0];

  } catch(err) {
    console.log(err)
  }

  // Adding correct / false to choices
  choices[0]["correct"] = true;
  for (let i = 1; i < choices.length; i++) {choices[i]["correct"] = false;}
  res.json(choices)
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});