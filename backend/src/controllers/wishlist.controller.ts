import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new wishlist
export const createWishlist = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const userId = req.user!.id;

    const wishlist = await prisma.wishlists.create({
      data: {
        name,
        userId,
      },
    });

    res.status(201).json({ wishlist });
  } catch (error) {
    console.error("Create wishlist error:", error);
    res.status(500).json({ error: "Server error while creating wishlist" });
  }
};

// Get all wishlists for the current user
export const getWishlists = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const wishlists = await prisma.wishlists.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ wishlists });
  } catch (error) {
    console.error("Get wishlists error:", error);
    res.status(500).json({ error: "Server error while fetching wishlists" });
  }
};

// Get a single wishlist
export const getWishlist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const wishlist = await prisma.wishlists.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    if (wishlist.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this wishlist" });
    }

    res.json({ wishlist });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ error: "Server error while fetching wishlist" });
  }
};

// Update a wishlist
export const updateWishlist = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user!.id;

    const wishlist = await prisma.wishlists.findUnique({
      where: { id },
    });

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    if (wishlist.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this wishlist" });
    }

    const updatedWishlist = await prisma.wishlists.update({
      where: { id },
      data: { name },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    res.json({ wishlist: updatedWishlist });
  } catch (error) {
    console.error("Update wishlist error:", error);
    res.status(500).json({ error: "Server error while updating wishlist" });
  }
};

// Delete a wishlist
export const deleteWishlist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const wishlist = await prisma.wishlists.findUnique({
      where: { id },
    });

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    if (wishlist.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this wishlist" });
    }

    await prisma.wishlists.delete({
      where: { id },
    });

    res.json({ message: "Wishlist deleted successfully" });
  } catch (error) {
    console.error("Delete wishlist error:", error);
    res.status(500).json({ error: "Server error while deleting wishlist" });
  }
};

// Add item to wishlist
export const addItemToWishlist = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { itemId } = req.body;
    const userId = req.user!.id;

    // Check if wishlist exists and belongs to user
    const wishlist = await prisma.wishlists.findUnique({
      where: { id },
    });

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    if (wishlist.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to modify this wishlist" });
    }

    // Check if item exists
    const item = await prisma.items.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Check if item is already in wishlist
    const existingWishlistItem = await prisma.wishlistItems.findFirst({
      where: {
        wishlistId: id,
        itemId,
      },
    });

    if (existingWishlistItem) {
      return res.status(400).json({ error: "Item is already in wishlist" });
    }

    // Add item to wishlist
    const wishlistItem = await prisma.wishlistItems.create({
      data: {
        wishlistId: id,
        itemId,
      },
      include: {
        item: true,
      },
    });

    res.status(201).json({ wishlistItem });
  } catch (error) {
    console.error("Add item to wishlist error:", error);
    res
      .status(500)
      .json({ error: "Server error while adding item to wishlist" });
  }
};

// Remove item from wishlist
export const removeItemFromWishlist = async (req: Request, res: Response) => {
  try {
    const { id, itemId } = req.params;
    const userId = req.user!.id;

    // Check if wishlist exists and belongs to user
    const wishlist = await prisma.wishlists.findUnique({
      where: { id },
    });

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    if (wishlist.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to modify this wishlist" });
    }

    // Check if item exists in wishlist
    const wishlistItem = await prisma.wishlistItems.findFirst({
      where: {
        wishlistId: id,
        itemId,
      },
    });

    if (!wishlistItem) {
      return res.status(404).json({ error: "Item not found in wishlist" });
    }

    // Remove item from wishlist
    await prisma.wishlistItems.delete({
      where: {
        id: wishlistItem.id,
      },
    });

    res.json({ message: "Item removed from wishlist successfully" });
  } catch (error) {
    console.error("Remove item from wishlist error:", error);
    res
      .status(500)
      .json({ error: "Server error while removing item from wishlist" });
  }
};
