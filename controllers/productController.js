import Product from "../models/Product.js";

// GET ALL PRODUCTS
export const getAllProducts = async (
  req,
  res
) => {
  try {
    const products = await Product.find()
      .sort({
        createdAt: -1,
      });

    res.json(products);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET FARMER PRODUCTS
export const getMyProducts = async (
  req,
  res
) => {
  try {
    const products = await Product.find({
      farmerId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json(products);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE PRODUCT
export const createProduct = async (
  req,
  res
) => {
  try {
    const {
      name,
      price,
      unit,
      category,
    } = req.body;

    // IMAGE
    const image = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : "";

    const product =
      await Product.create({
        name,
        price,
        unit,
        category,
        image,
        farmerId: req.user._id,
        farmerName:
          req.user.name,
      });

    res.status(201).json({
      message:
        "Product uploaded successfully",
      product,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res
        .status(404)
        .json({
          message:
            "Product not found",
        });
    }

    // CHECK OWNER
    if (
      product.farmerId.toString() !==
      req.user._id.toString()
    ) {
      return res
        .status(401)
        .json({
          message:
            "Not authorized",
        });
    }

    await product.deleteOne();

    res.json({
      message:
        "Product deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};