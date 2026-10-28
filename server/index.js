import "dotenv/config";
import express from "express";
import cors from "cors";
import { getProfile, getNetwork, HttpError } from "./github.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));

app.get("/api/users/:username", async (req, res) => {
  res.json(await getProfile(req.params.username));
});

app.get("/api/users/:username/network", async (req, res) => {
  res.json(await getNetwork(req.params.username, req.query.per_page));
});

// Error handler: turns thrown errors into JSON responses
app.use((err, req, res, next) => {
  const status = err instanceof HttpError ? err.status : 500;
  res
    .status(status)
    .json({ error: status === 500 ? "Internal server error." : err.message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
