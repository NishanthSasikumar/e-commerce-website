import { useContext, useEffect, useState } from "react";
import { Row, Col, Card, Button, message } from "antd";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { countThunk } from "../thunks";
import { decreaseCount, increaseCount } from "../slicers";
import { socket } from "../App";

const Cart = () => {
  const dispatch = useDispatch();
  const { role, email } = useSelector((state) => state.role);
  const count = useSelector((state) => state.count);

  const [cart, setCart] = useState([]);

  const getCart = async () => {
    try {
      if (!role) {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(localCart);
        const total = localCart.reduce(
          (sum, item) => sum + item.productCount,
          0,
        );

        dispatch(decreaseCount(total));
        return;
      }
      const response = await axios.get("http://localhost:3000/cart/get", {
        withCredentials: true,
      });
      setCart(response.data.cart);
      dispatch(countThunk());
    } catch (error) {
      console.log(error);
    }
  };
  console.log(cart);

  const getBadgeCount = async () => {
    try {
      dispatch(countThunk());
    } catch (error) {
      console.log(error);
    }
  };

  const increaseQuantity = async (item) => {
    try {
      console.log(item);

      const quantity = item.cart.find((ele) => ele.email == email);
      console.log(quantity);

      if (quantity.quantity >= item.stock) {
        message.info("limited availability");
        return;
      }
      await axios.put(
        `http://localhost:3000/cart/increase/${item.id}`,
        {},
        {
          withCredentials: true,
        },
      );

      setCart((prev) =>
        prev.map((product) =>
          product.id === item.id
            ? {
                ...product,
                cart: product.cart.map((ele) =>
                  ele.email === email
                    ? {
                        ...ele,
                        quantity: ele.quantity + 1,
                      }
                    : ele,
                ),
              }
            : product,
        ),
      );

      dispatch(increaseCount(count + 1));
    } catch (error) {
      console.log(error);
    }
  };

  const decreaseQuantity = async (item) => {
    try {
      const quantity = item.cart.find((ele) => ele.email == email);
      console.log(quantity);

      if (quantity.quantity <= 1) {
        message.info("quantity should be greater than zero");
        return;
      }
      await axios.put(
        `http://localhost:3000/cart/decrease/${item.id}`,
        {},
        {
          withCredentials: true,
        },
      );

      setCart((prev) =>
        prev.map((product) =>
          product.id === item.id
            ? {
                ...product,
                cart: product.cart.map((ele) =>
                  ele.email === email
                    ? {
                        ...ele,
                        quantity: ele.quantity - 1,
                      }
                    : ele,
                ),
              }
            : product,
        ),
      );

      dispatch(decreaseCount(count != 0 ? count - 1 : 0));
    } catch (error) {
      console.log(error);
    }
  };

  const removeProduct = async (item) => {
    
    try {
      const quantity = item.cart.find((ele) => ele.email == email);
      const reponse = await axios.delete(
        `http://localhost:3000/cart/remove/${item.id}`,
        {
          withCredentials: true,
        },
      );
      setCart((prev) => prev.filter((product) => product.id !== item.id));
      dispatch(
        decreaseCount(
          count != 0 ? count - (quantity?.quantity|| 0) : 0,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const reduceStock = async (item) => {
    try {
      if(item.stock<=0)
      {
        message.info("prodcut not available");
        return;
      }
      const quantity = item.cart.find((ele) => ele.email == email);
      const response = await axios.patch(
        `http://localhost:3000/product/${item.id}`,
        { quantity: quantity.quantity },
        {
          withCredentials: true,
        },
      );
      setCart((prev) => prev.filter((product) => product.id !== item.id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("Socket Connected:", socket.connected);

    socket.on("connect", () => {
      console.log("Connected: In productOne", socket.id);
    });
    socket.on("stockCount", (updatedProduct) => {
      console.log("Hi");

      setCart((prev) => {
        const updatedProducts = prev.map((item) =>
          item.id === updatedProduct.id ? updatedProduct : item,
        );
        return updatedProducts.filter((item) => item.stock >= 0);
      });
    });
    getBadgeCount();
    getCart();
  }, [role]);
  console.log(cart);
  
  return (
    <Row gutter={[16, 16]}>
      {cart?.map((item) => {
        return (
          <Col span={6} key={item.id}>
            <Card
              cover={
                <img
                  draggable={false}
                  src={`https://loremflickr.com/800/500/${item.category}?lock=${item.id}`}
                />
              }
              actions={
                item.isDeleted === false
                  ? [
                      <PlusOutlined onClick={() => increaseQuantity(item)} />,
                      <MinusOutlined onClick={() => decreaseQuantity(item)} />,
                      <DeleteOutlined onClick={() => removeProduct(item)} />,
                      <Button
                        onClick={() => {
                          reduceStock(item);
                        }}
                      >
                        Buy now
                      </Button>,
                    ]
                  : []
              }
            >
              <h2>{item.name}</h2>

              <p>₹ {item.price}</p>
              <p>{item?.stock}</p>
              <p>{item?.description}</p>

              <p>Quantity : {item?.cart?.find((ele) => ele.email == email)?.quantity}</p>
              {(item?.isDeleted || item?.stock <= 0) && (
                <p style={{ color: "red" }}>Product not available</p>
              )}

              {
                item?.stock > 0 && (item?.cart?.find((ele) => ele.email == email)?.quantity) > item?.stock && (
                  <p>only {item?.stock} product available </p>
                )
              }
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default Cart;
