import express from "express";
import {
  deleteRoutes,
  getRoutes,
  getRoutesById,
  postRoutes,
  updateRoutes,
} from "../controller/postController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getRoutes);
router.post("/", verifyToken, postRoutes);
router.get("/:id", verifyToken, getRoutesById);
router.put("/:id", verifyToken, updateRoutes);
router.delete("/:id", verifyToken, deleteRoutes);

export default router;
