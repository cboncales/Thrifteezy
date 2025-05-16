import { Router } from "express";
import { body } from "express-validator";
import { authenticateToken } from "../middleware/auth.middleware";
import { getAllUsers, updateUserRole } from "../controllers/user.controller";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Validation middleware
const roleValidation = [
  body("role")
    .isIn(["USER", "ADMIN"])
    .withMessage("Role must be either USER or ADMIN"),
];

// Routes
router.get("/", getAllUsers);
router.patch("/:id/role", roleValidation, updateUserRole);

export default router; 