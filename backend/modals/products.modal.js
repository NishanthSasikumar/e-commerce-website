import mongoose from "mongoose";

const productsSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
    },
    cart: [
      {
        email: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        }
      },
    ],
  },
  { timestamps: true },
);

const productsModal = mongoose.model("Product", productsSchema);

export { productsModal };
