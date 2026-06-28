import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    unit: {
      type: String,
      default: "kg",
    },

    category: {
      type: String,
      default: "vegetables",
    },

    image: {
      type: String,
      default: "",
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    farmerId: {
      type: String,
      required: true,
    },

    farmerName: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Product",
  productSchema
);