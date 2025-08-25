import express from "express";
import axios from "axios";
import Result from "../models/Result.js";

const router = express.Router();

// POST /api/search
router.post("/search", async (req, res) => {
  const { keyword } = req.body;
  try {
    const response = await axios.get(
      `https://api.github.com/search/repositories?q=${keyword}&per_page=5`
    );
    // console.log(response.data);
    const repos = response.data.items.map(repo => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description
    }));
    
    console.log(repos);

    // const newResult = new Result({ keyword, results: repos });
    // await newResult.save();

    return res.json(repos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// GET /api/results
router.get("/results", async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

export default router;
