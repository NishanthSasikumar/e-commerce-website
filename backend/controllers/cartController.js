import { productsModal } from "../modals/products.modal.js";
import { logger } from "../utils/logger.js";

const addToCart = async (req, res) => {
  try {
    const { id } = req.body;
    const email = req.email;
    const product = await productsModal.findOne({
      id,
      isDeleted: false,
    });
    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    const userExist = product.cart.find((item) => item.email === email);
    if (userExist) {
      userExist.quantity += 1;
    } else {
      product.cart.push({
        email,
        quantity: 1,
      });
    }
    await product.save();
    return res.status(200).json({
      success: true,
      message: "Added to cart",
    });
  } catch (error) {
    logger.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getCart = async (req, res) => {
  try {
    const email = req.email;

    const cartProducts = await productsModal.find({
      cart: {
        $elemMatch: {
          email,
        },
      },
    });

    return res.status(200).json({
      success: true,
      cart: cartProducts,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const increaseQuantity = async (req, res) => {
  try {
    const id = req.params.id;
    const email = req.email;
    const product = await productsModal.findOne({
      id,
    });
    if (!product)
      return res.status(404).json({
        success: false,
      });
    const userCart = product.cart.find((item) => item.email === email);
    if (!userCart)
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    userCart.quantity += 1;
    await product.save();
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      success: false,
    });
  }
};

const decreaseQuantity = async (req, res) => {
  try {
    const id = req.params.id;
    const email = req.email;
    const product = await productsModal.findOne({
      id,
    });
    if (!product)
      return res.status(404).json({
        success: false,
      });
    const userCart = product.cart.find((item) => item.email === email);
    if (!userCart)
      return res.status(404).json({
        success: false,
      });
    userCart.quantity -= 1;
    if (userCart.quantity <= 0) {
      product.cart = product.cart.filter((item) => item.email !== email);
    }
    await product.save();
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      success: false,
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const id = req.params.id;
    const email = req.email;
    const product = await productsModal.findOne({
      id,
    });
    if (!product)
      return res.status(404).json({
        success: false,
      });
    product.cart = product.cart.filter((item) => item.email !== email);
    await product.save();
    return res.status(200).json({
      success: true,
      message: "Removed from cart",
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      success: false,
    });
  }
};

const getCartCount = async (req, res) => {
  try {
    const email = req.email;
    const products = await productsModal.find({
      cart: {
        $elemMatch: {
          email,
        },
      },
    });

    let count = 0;
    products.forEach((product) => {
      const userCart = product.cart.find((item) => item.email === email);

      count += userCart.quantity;
    });
    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      success: false,
    });
  }
};


export {
  addToCart,
  getCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  getCartCount,
};
