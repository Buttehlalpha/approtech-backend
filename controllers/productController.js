import Product from "../models/Product.js";

// @desc    Create a new product
export const createProduct = async (req, res) => {
  try {
    console.log("=== CREATE PRODUCT ===");
    console.log("User ID:", req.user?._id || req.userId);
    console.log("Request body:", req.body);
    console.log("File uploaded:", req.file);

    const { name, price, unit, category } = req.body;

    if (!name || !price) {
      return res.status(400).json({ 
        success: false,
        message: "Name and price are required" 
      });
    }

    // ✅ FIXED: Use production URL
    let imageUrl = '';
    if (req.file) {
      const baseUrl = process.env.BASE_URL || 'https://approtech-backend.onrender.com';
      const filename = req.file.filename;
      imageUrl = `${baseUrl}/uploads/${filename}`;
      console.log("✅ Full image URL saved:", imageUrl);
    }

    const product = new Product({
      name: name.trim(),
      price: Number(price),
      unit: unit || 'kg',
      category: category || 'vegetables',
      image: imageUrl,
      farmerId: req.user?._id || req.userId,
      farmerName: req.user?.name || 'Farmer',
      inStock: true
    });

    await product.save();
    console.log("✅ Product saved with image:", product.image);

    res.status(201).json({
      success: true,
      product: product
    });

  } catch (error) {
    console.error("❌ Create product error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to create product"
    });
  }
};

// @desc    Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error("Get all products error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch products" 
    });
  }
};

// @desc    Get farmer's products
export const getMyProducts = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId;
    console.log("Getting products for user:", userId);
    
    const products = await Product.find({ farmerId: userId });
    console.log(`✅ Found ${products.length} products for farmer`);
    
    // ✅ FIX: Replace localhost with production URL
    const fixedProducts = products.map(product => {
      if (product.image) {
        if (product.image.includes('localhost:5000')) {
          product.image = product.image.replace(
            'http://localhost:5000',
            'https://approtech-backend.onrender.com'
          );
          console.log(`✅ Fixed image URL for ${product.name}: ${product.image}`);
        }
      }
      return product;
    });
    
    fixedProducts.forEach(p => {
      console.log(`📦 ${p.name} - Image: ${p.image || 'No image'}`);
    });
    
    res.json(fixedProducts);
  } catch (error) {
    console.error("Get my products error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch products" 
    });
  }
};

// @desc    Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }

    if (product.farmerId.toString() !== userId.toString()) {
      return res.status(403).json({ 
        success: false,
        message: "Not authorized to delete this product" 
      });
    }

    await Product.findByIdAndDelete(productId);
    res.json({ 
      success: true,
      message: "Product deleted successfully" 
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete product" 
    });
  }
};