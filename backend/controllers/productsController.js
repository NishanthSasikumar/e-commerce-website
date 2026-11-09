import { io } from "../main.js";
import { productsModal } from "../modals/products.modal.js";
import { logger } from "../utils/logger.js";

const getAll = async (req, res) => {
  try {
    const params = req.query?.q;
    let products;
    if (params) {
      products = await productsModal.find({
        isDeleted: false,
        name: {
          $regex: params,
          $options: "i",
        },
      });
    } else {
      products = await productsModal.find({
        isDeleted: false,
      });
    }
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const getProducts = async (req, res) => {
  try {
    const query = req.params?.category;
    const params = req.query?.q;
    let getProduct;
    if (!params) {
      getProduct = await productsModal.find({
        category: query,
        isDeleted: false,
      });
    } else {
      getProduct = await productsModal.find({
        category: query,
        isDeleted: false,
        name: {
          $regex: params,
          $options: "i",
        },
      });
    }

    if (!getProduct)
      return res
        .status(404)
        .json({ success: false, message: "No product found" });
    return res.status(200).json({
      success: true,
      products: getProduct,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const postProducts = async (req, res) => {
  try {
    const query = req.params?.category;
    const body = req.body;
    const product = {
      id: Date.now(),
      name: body?.name,
      price: body?.price,
      description: body?.description,
      stock: body?.stock,
      category: body?.category,
      rating: body?.rating,
      isDeleted: false,
      cart: [],
    };

    const postProduct = await productsModal.create(product);
    logger.info("Emitting");
    io.emit("product-added", postProduct);
    return res.status(201).json({
      success: true,
      message: "product added successfully",
      postProduct,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const putProducts = async (req, res) => {
  try {
    const id = req.params?.id;

    const body = req.body;

    const putProduct = await productsModal.findOneAndUpdate(
      { id, isDeleted: false },
      { $set: body },
      { returnDocument: "after" },
    );
    io.emit("product-updated", putProduct);
    if (!putProduct)
      return res
        .status(404)
        .json({ success: false, message: "No product found" });
    return res
      .status(200)
      .json({ success: true, message: "Updated successfully", putProduct });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const deleteProducts = async (req, res) => {
  try {
    const id = req.params?.id;
    const deleteProduct = await productsModal.updateOne(
      { id },
      { $set: { isDeleted: true } },
    );
    io.emit("product-deleted", {
      id,
    });
    if (deleteProduct.modifiedCount == 0)
      return res
        .status(404)
        .json({ success: false, message: "No product found" });
    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const reducerStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    const email = req.email;
    const { id } = req.params;
    console.log(quantity);

    const productStock = await productsModal.findOne({ id, isDeleted: false });

    if (quantity <= productStock.stock)
      return res.status(404).json({ message: "Product not found" });

    const product = await productsModal.findOneAndUpdate(
      { id, isDeleted: false },
      {
        $inc: { stock: -quantity },
        $pull: {
          cart: {
            email,
          },
        },
      },
      { returnDocument: "after" },
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    logger.info("Product emitted");
    io.emit("stockCount", product);
    logger.info(product);
    return res.status(200).json({ success: true, product });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export {
  getProducts,
  postProducts,
  putProducts,
  deleteProducts,
  getAll,
  reducerStock,
};
