import { Router } from "express";
import { body } from "express-validator";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
  getUserItems,
} from "../controllers/item.controller";

const router = Router();

// Validation middleware
const itemValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("size").notEmpty().withMessage("Size is required"),
  body("condition").notEmpty().withMessage("Condition is required"),
  body("photoUrl").notEmpty().withMessage("Photo URL is required"),
];

// Public routes
router.get("/", getItems);
router.get("/:id", getItem);

// Protected routes (require authentication)
router.post("/", authenticateToken, itemValidation, createItem);
router.put("/:id", authenticateToken, itemValidation, updateItem);
router.delete("/:id", authenticateToken, deleteItem);
router.get("/user/items", authenticateToken, getUserItems);

export default router;
