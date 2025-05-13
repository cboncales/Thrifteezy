import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items } = req.body;
    const userId = req.user!.id;

    // Start a transaction
    const order = await prisma.$transaction(async (prisma) => {
      // Calculate total and verify items
      let total = 0;
      const orderItems = [];

      for (const item of items) {
        const dbItem = await prisma.item.findUnique({
          where: { id: item.itemId },
        });

        if (!dbItem) {
          throw new Error(`Item ${item.itemId} not found`);
        }

        if (dbItem.status !== "available") {
          throw new Error(`Item ${dbItem.title} is not available`);
        }

        if (dbItem.userId === userId) {
          throw new Error("Cannot order your own items");
        }

        total += dbItem.price * item.quantity;
        orderItems.push({
          itemId: item.itemId,
          quantity: item.quantity,
          price: dbItem.price,
        });

        // Update item status
        await prisma.item.update({
          where: { id: item.itemId },
          data: { status: "reserved" },
        });
      }

      // Create order
      const order = await prisma.order.create({
        data: {
          userId,
          status: "pending",
          total,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              item: true,
            },
          },
        },
      });

      return order;
    });

    res.status(201).json({ order });
  } catch (error: any) {
    console.error("Create order error:", error);
    res
      .status(400)
      .json({ error: error.message || "Server error while creating order" });
  }
};

// Get all orders (admin only)
export const getOrders = async (req: Request, res: Response) => {
  try {
    const { status, page = "1", limit = "10" } = req.query;
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    const where: any = {};
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              item: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNumber,
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      orders,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: "Server error while fetching orders" });
  }
};

// Get a single order
export const getOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if user is authorized to view this order
    if (order.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this order" });
    }

    res.json({ order });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ error: "Server error while fetching order" });
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user!.id;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if user is authorized to update this order
    if (order.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this order" });
    }

    // Update order status and item statuses
    const updatedOrder = await prisma.$transaction(async (prisma) => {
      // Update order status
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status },
        include: {
          items: {
            include: {
              item: true,
            },
          },
        },
      });

      // Update item statuses based on order status
      if (status === "completed") {
        for (const orderItem of order.items) {
          await prisma.item.update({
            where: { id: orderItem.item.id },
            data: { status: "sold" },
          });
        }
      } else if (status === "cancelled") {
        for (const orderItem of order.items) {
          await prisma.item.update({
            where: { id: orderItem.item.id },
            data: { status: "available" },
          });
        }
      }

      return updatedOrder;
    });

    res.json({ order: updatedOrder });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ error: "Server error while updating order status" });
  }
};

// Get orders for the current user
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status } = req.query;

    const where: any = { userId };
    if (status) where.status = status;

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ orders });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ error: "Server error while fetching user orders" });
  }
};
