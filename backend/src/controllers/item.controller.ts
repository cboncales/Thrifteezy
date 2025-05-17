import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new item
export const createItem = async (req: Request, res: Response) => {
  try {
    console.log("Request body:", req.body);
    console.log("Headers:", req.headers);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, price, size, condition, photoUrl, category } =
      req.body;

    console.log("Extracted fields:", {
      title,
      description,
      price,
      size,
      condition,
      photoUrl,
      category,
    });

    if (!req.user) {
      console.log("No user in request");
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.user.id;
    console.log("User ID:", userId);

    const item = await prisma.items.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        size,
        category,
        condition,
        photoUrl,
        userId,
      },
    });

    console.log("Created item:", item);
    res.status(201).json({ item });
  } catch (error) {
    console.error("Create item error:", error);
    res.status(500).json({ error: "Server error while creating item" });
  }
};

// Get all items with optional filtering
export const getItems = async (req: Request, res: Response) => {
  try {
    const {
      search,
      minPrice,
      maxPrice,
      size,
      condition,
      status = "available",
      page = "1",
      limit = "10",
    } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    // Build filter conditions
    const where: any = { status };

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    if (minPrice)
      where.price = { ...where.price, gte: parseFloat(minPrice as string) };
    if (maxPrice)
      where.price = { ...where.price, lte: parseFloat(maxPrice as string) };
    if (size) where.size = size;
    if (condition) where.condition = condition;

    const [items, total] = await Promise.all([
      prisma.items.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNumber,
      }),
      prisma.items.count({ where }),
    ]);

    res.json({
      items,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error("Get items error:", error);
    res.status(500).json({ error: "Server error while fetching items" });
  }
};

// Get a single item by ID
export const getItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const item = await prisma.items.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ item });
  } catch (error) {
    console.error("Get item error:", error);
    res.status(500).json({ error: "Server error while fetching item" });
  }
};

// Update an item
export const updateItem = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const userId = req.user!.id;
    const { title, description, price, size, condition, photoUrl, status } =
      req.body;

    // Check if item exists and belongs to user
    const existingItem = await prisma.items.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (existingItem.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this item" });
    }

    const item = await prisma.items.update({
      where: { id },
      data: {
        title,
        description,
        price: parseFloat(price),
        size,
        condition,
        photoUrl,
        status: status || existingItem.status,
      },
    });

    res.json({ item });
  } catch (error) {
    console.error("Update item error:", error);
    res.status(500).json({ error: "Server error while updating item" });
  }
};

// Delete an item
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if item exists and belongs to user
    const existingItem = await prisma.items.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (existingItem.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this item" });
    }

    await prisma.items.delete({
      where: { id },
    });

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Delete item error:", error);
    res.status(500).json({ error: "Server error while deleting item" });
  }
};

// Get items for the current user
export const getUserItems = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status } = req.query;

    const where: any = { userId };
    if (status) where.status = status;

    const items = await prisma.items.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json({ items });
  } catch (error) {
    console.error("Get user items error:", error);
    res.status(500).json({ error: "Server error while fetching user items" });
  }
};
