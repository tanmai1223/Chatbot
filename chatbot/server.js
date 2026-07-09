import express from "express";
import cors from "cors";
import dotenv from "dotenv";
//import { main } from "./geminiAPI.js";
import route from "./routes/chats.js";
import db from "./config/db.js";

dotenv.config();

db();

const app=express();

app.use(
  cors({
    origin: "http://localhost:5173",
    exposedHeaders: ["X-Chat-Id"],
  })
);
app.use(express.json());
app.use("/api",route);
//main();

app.get("/", async (req, res) => {
  res.send("Hello world")
});


app.listen(3000,()=>{
    console.log(`Server running at http://localhost:3000`)
})