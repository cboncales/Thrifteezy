import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Check if user is admin
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const users = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ error: "Server error while fetching users" });
  }
};

// Update user role (admin only)
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user is admin
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { id } = req.params;
    const { role } = req.body;

    if (!["USER", "ADMIN"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await prisma.users.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({ error: "Server error while updating user role" });
  }
}; 