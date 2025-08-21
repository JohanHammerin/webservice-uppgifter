import express, { type Request, type Response } from "express";
import "dotenv/config";
import { closeDB, getDB, runDB } from "./db/database.js";
import { type Db } from "mongodb";

const app = express();
const port: number = 3001;

// ===== SPECIFIKA ROUTES FÖRST =====
/*

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Hello world" });
});

app.get("/test", (req: Request, res: Response) => {
  console.log("✅ Test route hit!");
  res.send("Test works");
});
*/
app.get("/comments/:name", async (req: Request, res: Response) => {
  const db: Db = getDB();
  const name = req.params.name;
  console.log("🔍 Searching for:", JSON.stringify(name));
  console.log("Using DB:", db.databaseName);

  try {
    const result = await db
      .collection("comments")
      .find({ name })
      .limit(25)
      .toArray();

    console.log("📦 Found:", result);

    if (result.length === 0) {
      res.status(404).send({ message: "Nothing was found" });
      return;
    }

    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

// ===== GENERISKA ROUTES LÄNGST NER =====
/*
app.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).send({ message: "Not a number" });
    return;
  }
  res.send({ id });
});
*/

// ===== START SERVER =====
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
    console.error(error);
  }
}

startServer();
