import express from "express";
import Categories from "../models/Categories.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newCat = new Categories(req.body);
    const savedCat = await newCat.save();
    res.status(200).json(savedCat);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
