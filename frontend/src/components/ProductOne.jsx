import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { Row, Modal, Input, Button, Form, message } from "antd";
import BuildCard from "../BuildCard";
import { useRef } from "react";
import { socket } from "../App";

const ProductOne = ({
  count,
  setCount,
  location,
  Products,
  search,
  sortBy,
}) => {
  const [product, setProduct] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState({});
  const [errors, setErrors] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category: "",
    rating: "",
  });
  useEffect(() => {

    socket.on("product-added", (newProduct) => {
      if (newProduct.category === location) {
        setProduct((prev) => [...prev, newProduct]);
      }
    });
    socket.on("product-updated", (updatedProduct) => {
      setProduct((prev) =>
        prev.map((item) =>
          item.id === updatedProduct.id ? updatedProduct : item,
        ),
      );
    });
    socket.on("product-deleted", ({ id }) => {
      id = Number(id);
      setProduct((prev) => prev.filter((item) => item.id !== id));
    });

    const getCall = async () => {
      const getResponse = await axios.get(
        `http://localhost:3000/product/${location}`,
      );

      setProduct(getResponse.data.products);
    };
    getCall();
    return () => {
      socket.off("product-added");
      socket.off("product-updated");
      socket.off("product-deleted");
      socket.off("stockCount");
    };
  }, [location, Products]);

  // const filteredProducts = product?.filter((item) => {
  //   return item?.name?.toLowerCase()?.includes(search?.toLowerCase() || "");
  // });

  let controllerRef = useRef(null);
  const fetchProducts = useCallback(
    debounce(async (search, location) => {
      if (controllerRef?.current) {
        controllerRef?.current.abort();
      }
      controllerRef.current = new AbortController();
      try {
        const response = await axios.get(
          `http://localhost:3000/product/${location}?q=${search}`,
          { signal: controllerRef.current.signal },
        );
        setProduct(response?.data?.products || []);
      } catch (error) {
        console.log(error);
      }
    }, 3000),
    [],
  );

  useEffect(() => {
    fetchProducts(search, location);
    return () => {
      controllerRef?.current?.abort();
    };
  }, [search.location]);
  const sortedProducts = [...product];

  switch (sortBy) {
    case "priceLowToHigh":
      sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
      break;

    case "priceHighToLow":
      sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
      break;

    case "aToZ":
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case "zToA":
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;

    default:
      break;
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/product/${id}`);

      setProduct((prev) => prev.filter((item) => item.id !== id));

      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

      const updatedCart = storedCart.filter((item) => item.id !== id);

      setCount((prev) => prev - 1);

      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const updateProduct = async () => {
    try {
      let key = false;
      const newErrors = {};

      if (!editProduct.name.trim()) {
        key = true;
        newErrors.name = "Product Name is required";
      }

      if (!String(editProduct.price).trim()) {
        key = true;
        newErrors.price = "Price is required";
      }

      if (!editProduct.description.trim()) {
        key = true;
        newErrors.description = "Description is required";
      }

      if (!String(editProduct.stock).trim()) {
        key = true;
        newErrors.stock = "Stock is required";
      }

      if (!editProduct.category.trim()) {
        key = true;
        newErrors.category = "Category is required";
      }

      if (!String(editProduct.rating).trim()) {
        key = true;
        newErrors.rating = "Rating is required";
      }

      setErrors(newErrors);
      if (key) return;

      const response = await axios.put(
        `http://localhost:3000/product/${editProduct.id}`,
        editProduct,
      );

      setProduct((prev) =>
        prev.map((item) =>
          item.id === editProduct.id ? response.data.putProduct : item,
        ),
      );
      setErrors({
        name: "",
        price: "",
        description: "",
        stock: "",
        category: "",
        rating: "",
      });
      setEditModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        title="Edit Product"
        open={editModal}
        onCancel={() => setEditModal(false)}
        footer={null}
      >
        <Form onFinish={updateProduct}>
          <Form.Item
            label="Product Name"
            validateStatus={errors.name ? "error" : ""}
            help={errors.name}
          >
            <Input
              name="name"
              value={editProduct.name}
              onChange={handleEditChange}
            />
          </Form.Item>

          <Form.Item
            label="Price"
            validateStatus={errors.price ? "error" : ""}
            help={errors.price}
          >
            <Input
              name="price"
              value={editProduct.price}
              onChange={handleEditChange}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            validateStatus={errors.description ? "error" : ""}
            help={errors.description}
          >
            <Input.TextArea
              name="description"
              value={editProduct.description}
              onChange={handleEditChange}
              rows={3}
            />
          </Form.Item>

          <Form.Item
            label="Stock"
            validateStatus={errors.stock ? "error" : ""}
            help={errors.stock}
          >
            <Input
              name="stock"
              value={editProduct.stock}
              onChange={handleEditChange}
            />
          </Form.Item>

          <Form.Item
            label="Category"
            validateStatus={errors.category ? "error" : ""}
            help={errors.category}
          >
            <Input
              name="category"
              value={editProduct.category}
              onChange={handleEditChange}
            />
          </Form.Item>

          <Form.Item
            label="Rating"
            validateStatus={errors.rating ? "error" : ""}
            help={errors.rating}
          >
            <Input
              name="rating"
              value={editProduct.rating}
              onChange={handleEditChange}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit">
              Update Product
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Row gutter={[16, 16]}>
        <BuildCard
          product={sortedProducts}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          setCount={setCount}
        />
      </Row>
    </>
  );
};
export default ProductOne;
