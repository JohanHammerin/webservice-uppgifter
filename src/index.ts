import express, { type Request, type Response } from "express";
import "dotenv/config"; // oneliner for configuration
import { closeDB, runDB } from "./db/database.js";

const app = express();
const port: number = 3001;

app.get("/:id", (req: Request, res: Response) => {
  const id: number = Number(req.params.id); // Casting

  if (isNaN(id)) {
    res.status(400).send("Not a number");
    return;
  }

  res.send({ id: id });
});

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Hello world!" });
});

async function startServer() {
  try {
    await runDB();
    app.listen(port, () => {
      console.log(`Listening to port ${port}`);
      console.log(`Start the app: http://localhost:${port}`);
    });
    process.on("SIGINT", async () => {
      console.log("Cleaning up...");
      await closeDB();
      process.exit(0);
    });
  } catch (error) {
    console.log(error);
  }
}
startServer();

/*
app.get("/", (request, response) => {
  response.send("Hello world!");
});
*/

/*
app.get("/", (request, response) => {
  response.send({ message: "Hello world" });
});
*/

/*
app.get("/", (request, response) => {
  response.status(200).send({ message: "Hello world" });
});
*/
