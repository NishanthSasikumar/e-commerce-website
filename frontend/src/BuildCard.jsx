import { Card, Col, Modal, Button } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { countThunk } from "./thunks";
import { decreaseCount, increaseCount } from "./slicers";

const BuildCard = ({ product, handleDelete, handleEdit }) => {
  const { Meta } = Card;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { role, permission } = useSelector((state) => state.role);
  const count = useSelector((state) => state.count);

  const addToCart = async (element) => {
    if (!role) {
      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

      const index = existingCart.findIndex((item) => item.id === element.id);

      if (index !== -1) {
        existingCart[index].productCount += 1;
      } else {
        existingCart.push({
          ...element,
          productCount: 1,
        });
      }
      const total = existingCart.reduce(
        (sum, item) => sum + item.productCount,
        0,
      );
      dispatch(decreaseCount(total));
      localStorage.setItem("cart", JSON.stringify(existingCart));

      return;
    }

    await axios.post(
      "http://localhost:3000/cart/add",
      {
        id: element.id,
      },
      {
        withCredentials: true,
      },
    );
    dispatch(increaseCount(count + 1));
  };
  useEffect(() => {
    dispatch(countThunk());
  }, []);
  const action = (element) => {
    return permission?.includes("edit&delete")
      ? [
          <EditOutlined onClick={() => handleEdit(element)} />,
          <DeleteOutlined onClick={() => handleDelete(element.id)} />,
          <ShoppingCartOutlined
            onClick={() => {
              addToCart(element);
            }}
          />,
        ]
      : [
          <ShoppingCartOutlined
            onClick={() => {
              addToCart(element);
            }}
          />,
        ];
  };
  console.log(product);
  
  return (
    <>
      {product?.map((element) => {
          return (
            <Col span={6} key={element?.id}>
              <Card
                cover={
                  <img
                    draggable={false}
                    onClick={() =>
                      navigate(`/product/${element?.id}`, {
                        state: element,
                      })
                    }
                    src={`https://loremflickr.com/800/500/${element?.category}?lock=${element?.id}`}
                  />
                }
                actions={action(element)}
              >
                <h2>{element?.name}</h2>
                <p>₹ {element?.price}</p>
                {element.stock <= 0  ? <p style={{color : "red"}}>Out of stock</p> : <p>stock : {element.stock}</p>}
              </Card>
            </Col>
          );
      })}
    </>
  );
};

export default BuildCard;
