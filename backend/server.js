import express from 'express';

const app = express();

app.get('/api/notes', (req, res) => {
  res.send("Note fetched.");
});

app.listen(5001, () => {
  console.log("DB Connected");
});