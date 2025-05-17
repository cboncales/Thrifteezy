// Create a new item
export const createItem = async (req: Request, res: Response) => {
  try {
    console.log("Request body:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, price, size, condition, photoUrl, category } =
      req.body;

    if (
      !title ||
      !description ||
      !price ||
      !size ||
      !condition ||
      !photoUrl ||
      !category
    ) {
      console.log("Missing required fields:", {
        title,
        description,
        price,
        size,
        condition,
        photoUrl,
        category,
      });
      return res.status(400).json({
        error: "Missing required fields",
        missing: Object.entries({
          title,
          description,
          price,
          size,
          condition,
          photoUrl,
          category,
        })
          .filter(([_, value]) => !value)
          .map(([key]) => key),
      });
    }

    const userId = req.user!.id;

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

    res.status(201).json({ item });
  } catch (error) {
    console.error("Create item error:", error);
    res.status(500).json({ error: "Server error while creating item" });
  }
};
