import { Router } from "express";
import { body } from "express-validator";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  createWishlist,
  getWishlists,
  getWishlist,
  updateWishlist,
  deleteWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
} from "../controllers/wishlist.controller";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Validation middleware
const wishlistValidation = [
  body("name").notEmpty().withMessage("Wishlist name is required"),
];

const itemValidation = [body("itemId").isUUID().withMessage("Invalid item ID")];

// Routes
router.post("/", wishlistValidation, createWishlist);
router.get("/", getWishlists);
router.get("/:id", getWishlist);
router.put("/:id", wishlistValidation, updateWishlist);
router.delete("/:id", deleteWishlist);

// Wishlist items routes
router.post("/:id/items", itemValidation, addItemToWishlist);
router.delete("/:id/items/:itemId", removeItemFromWishlist);

export default router;
