import { Router } from "express";
import { body } from "express-validator";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getUserOrders,
} from "../controllers/order.controller";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Validation middleware
const orderValidation = [
  body("items")
    .isArray()
    .withMessage("Items must be an array")
    .notEmpty()
    .withMessage("Items array cannot be empty"),
  body("items.*.itemId").isUUID().withMessage("Invalid item ID"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];

const statusValidation = [
  body("status")
    .isIn(["pending", "processing", "completed", "cancelled"])
    .withMessage("Invalid order status"),
];

// Routes
router.post("/", orderValidation, createOrder);
router.get("/", getOrders);
router.get("/user", getUserOrders);
router.get("/:id", getOrder);
router.patch("/:id/status", statusValidation, updateOrderStatus);

export default router;
