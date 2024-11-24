import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to my api" });
});

export default app;
