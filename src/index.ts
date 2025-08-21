import express from "express";

const app = express();
const port: number = 3001;

app.get("/", (request, response) => {
  response.send("Hello world!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
