import express from "express";
import cors from "cors";
import dotenv from "dotenv";
//import { main } from "./geminiAPI.js";
import route from "./routes/chats.js";
import db from "./config/db.js";

dotenv.config();

db();

const app=express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://chatbotmer.netlify.app",
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without Origin (Postman, curl, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
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