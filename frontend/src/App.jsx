import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { io } from "socket.io-client";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { SearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import pages from "./pages.json";
import {
  Button,
  Layout,
  Modal,
  Input,
  Badge,
  Radio,
  Select,
  Drawer,
  Slider,
  Form,
  Menu,
  Flex,
} from "antd";
import "./App.css";
import axios from "axios";
import ProductOne from "./components/ProductOne";

import { useContext, useEffect, useState } from "react";
import Home from "./components/Home";
import Cart from "./components/cart";
import ProductDetails from "./components/details";
import Users from "./components/users";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseCount,
  resetRole,
  setTicketNo,
  setRole,
  updateUserRole,
} from "./slicers";
import { countThunk, roleThunk } from "./thunks";
import IsValid from "./components/isValid";
import Permissions from "./components/permission";
import SupportUsers from "./components/queryTable";
import SupportChat from "./components/chat";
import MyTickets from "./components/myTickets";

export const socket = io("http://localhost:3000");
socket.on("connect", () => {
  console.log("Connected in Frontend");
});
function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { role, permission, userId, email } = useSelector((state) => state.role);

  const count = useSelector((state) => state.count);
  const [priceFilter, setPriceFilter] = useState(10000);
  const [drawer, setDrawer] = useState(false);
  const [sortBy, setSortBy] = useState();
  const [search, setSearch] = useState("");

  const [modal, setModal] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category: "",
    rating: "",
  });
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category: "",
    rating: "",
  });
  const [helpModal, setHelpModal] = useState(false);
  const [issue, setIssue] = useState("");

  useEffect(() => {
    socket.on("user-blocked", (data) => {
      if (userId == data.id) {
        navigate("/login");
      }
    });

    socket.on("permissionUpdated", (updatedRole) => {
      if (role === updatedRole.role) {
        dispatch(
          setRole({
            role: updatedRole.role,
            permission: updatedRole.permission,
            userId: userId,
            email: email,
          }),
        );
      }
    });
    return () => {
      socket.off("permission-updated");
    };
  }, [role]);

  useEffect(() => {
    dispatch(countThunk());
    dispatch(roleThunk());
  }, []);

  const navbarPages = pages.filter((page) => {
    if (permission?.includes(page.label)) return page?.showInNavbar;
  });

  const menuItems = [
    ...navbarPages,
    permission?.includes("Administration")
      ? {
          key: "admin",
          label: "Administration",
          children: [
            ...(permission?.includes("Users")
              ? [{ key: "/users", label: "Users" }]
              : []),
            ...(permission?.includes("Permission")
              ? [{ key: "/permissions", label: "Permissions" }]
              : []),
            ...(role && permission?.includes("AddProduct")
              ? [{ key: "add-product", label: "Add Product" }]
              : []),
            { key: "/supportusers", label: "Support Table" },
          ],
        }
      : "",
  ];

  if (!role) {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = existingCart.reduce(
      (sum, item) => sum + item.productCount,
      0,
    );
    dispatch(decreaseCount(total));
  }

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const addProduct = async () => {
    try {
      if (
        product.category != "clothes" &&
        product.category != "watches" &&
        product.category != "shoes"
      ) {
        alert("Give a proper category");
        return;
      }
      let key = false;
      const newErrors = {};
      if (!product.name.trim()) {
        key = true;
        newErrors.name = "Product Name is required";
      }
      if (!product.price.trim()) {
        key = true;
        newErrors.price = "Price is required";
      }
      if (!product.description.trim()) {
        key = true;
        newErrors.description = "Description is required";
      }
      if (!product.stock.trim()) {
        key = true;
        newErrors.stock = "Stock is required";
      }
      if (!product.category.trim()) {
        key = true;
        newErrors.category = "Category is required";
      }
      if (!product.rating.trim()) {
        key = true;
        newErrors.rating = "Rating is required";
      }
      setErrors(newErrors);
      if (key) return;
      await axios.post(
        `http://localhost:3000/product/${product.category}`,
        product,
      );
      setModal(false);
      setProduct({
        name: "",
        price: "",
        description: "",
        stock: "",
        category: "",
        rating: "",
      });
      setErrors({
        name: "",
        price: "",
        description: "",
        stock: "",
        category: "",
        rating: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const submitHelpTicket = async () => {
    if (!issue.trim()) {
      alert("Please describe your issue");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/ticket/create",
        { issue },
        { withCredentials: true },
      );
      const ticketNo = response.data.ticket.ticketNo;
      dispatch(setTicketNo(ticketNo));
      setIssue("");
      setHelpModal(false);
      navigate("/supportchat");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Drawer open={drawer} onClose={() => setDrawer(false)} placement="left">
        <h4>Price Filter: ₹{priceFilter}</h4>
        <Slider
          max={10000}
          defaultValue={10000}
          value={priceFilter}
          onChange={(value) => setPriceFilter(value)}
        />
      </Drawer>

      <Modal
        title="Add Product"
        open={modal}
        onCancel={() => setModal(false)}
        footer={null}
      >
        <Form onFinish={addProduct}>
          <Form.Item
            label="Product Name"
            validateStatus={errors.name ? "error" : ""}
            help={errors.name}
          >
            <Input name="name" value={product.name} onChange={handleChange} />
          </Form.Item>
          <Form.Item
            label="Price"
            validateStatus={errors.price ? "error" : ""}
            help={errors.price}
          >
            <Input name="price" value={product.price} onChange={handleChange} />
          </Form.Item>
          <Form.Item
            label="Description"
            validateStatus={errors.description ? "error" : ""}
            help={errors.description}
          >
            <Input
              name="description"
              value={product.description}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            label="Stock"
            validateStatus={errors.stock ? "error" : ""}
            help={errors.stock}
          >
            <Input name="stock" value={product.stock} onChange={handleChange} />
          </Form.Item>
          <Form.Item
            label="Category"
            validateStatus={errors.category ? "error" : ""}
            help={errors.category}
          >
            <Input
              name="category"
              value={product.category}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            label="Rating"
            validateStatus={errors.rating ? "error" : ""}
            help={errors.rating}
          >
            <Input
              name="rating"
              value={product.rating}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Product
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Raise a Support Ticket"
        open={helpModal}
        onCancel={() => {
          setHelpModal(false);
          setIssue("");
        }}
        footer={null}
      >
        <p>Describe your issue below</p>
        <Input.TextArea
          rows={4}
          placeholder="Type your issue here..."
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
        />
        <Button
          type="primary"
          style={{ marginTop: "15px" }}
          onClick={submitHelpTicket}
        >
          Submit
        </Button>
      </Modal>

      <Layout>
        <Header>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: "20px",
            }}
          >
            <h3 style={{ color: "white", margin: 0 }}>E-Commerce</h3>

            <Menu
              mode="horizontal"
              theme="dark"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={({ key }) => {
                if (key === "add-product") {
                  setModal(true);
                  return;
                }
                navigate(key);
              }}
              style={{ flex: 1 }}
            />

            {location.pathname !== "/users" &&
              location.pathname != "/permissions" && (
                <Input
                  className="search-input"
                  placeholder="Search Products"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: "250px" }}
                />
              )}

            <Button
              type="text"
              style={{ border: "1px solid white", color: "white" }}
              onClick={() => navigate("/mytickets")}
            >
              Help
            </Button>

            {location.pathname !== "/users" && (
              <Button
                onClick={() => setDrawer(true)}
                type="text"
                style={{ border: "1px solid white", color: "white" }}
              >
                Filter
              </Button>
            )}

            {!role ? (
              <Button
                type="text"
                style={{ border: "1px solid white", color: "white" }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            ) : (
              <Button
                type="text"
                style={{ border: "1px solid white", color: "white" }}
                onClick={async () => {
                  navigate("/");
                  dispatch(setTicketNo(""));
                  const localCart =
                    JSON.parse(localStorage.getItem("cart")) || [];
                  const total = localCart.reduce(
                    (sum, item) => sum + item.productCount,
                    0,
                  );
                  dispatch(decreaseCount(total));
                  dispatch(resetRole());
                  await axios.post(
                    "http://localhost:3000/auth/logout",
                    {},
                    { withCredentials: true },
                  );
                }}
              >
                Logout
              </Button>
            )}

            <Badge count={count}>
              <Link to="/cart">
                <ShoppingCartOutlined
                  style={{
                    color: "white",
                    fontSize: "24px",
                    cursor: "pointer",
                  }}
                />
              </Link>
            </Badge>
          </div>
        </Header>
      </Layout>

      <div
        style={{
          width: "97vw",
          marginTop : "10px",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        {location.pathname != "/users" &&
        location.pathname != "/permissions" ? (
          <Select
            style={{ width: 220, border: "1px solid black" }}
            placeholder="Sort by"
            value={sortBy}
            onChange={(value) => setSortBy(value)}
            options={[
              { value: "priceLowToHigh", label: "Price: Low to High" },
              { value: "priceHighToLow", label: "Price: High to Low" },
              { value: "aToZ", label: "Name: A-Z" },
              { value: "zToA", label: "Name: Z-A" },
            ]}
          />
        ) : (
          ""
        )}
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <Home
              priceFilter={priceFilter}
              Products={product}
              search={search}
              sortBy={sortBy}
            />
          }
        />
        <Route element={<IsValid locate={"Clothes"} />}>
          <Route
            path="/clothes"
            element={
              <ProductOne
                priceFilter={priceFilter}
                location="clothes"
                Products={product}
                search={search}
                sortBy={sortBy}
                errors={errors}
              />
            }
          />
        </Route>
        <Route element={<IsValid locate={"Watches"} />}>
          <Route
            path="/watches"
            element={
              <ProductOne
                priceFilter={priceFilter}
                location="watches"
                Products={product}
                search={search}
                sortBy={sortBy}
                errors={errors}
              />
            }
          />
        </Route>
        <Route element={<IsValid locate={"Shoes"} />}>
          <Route
            path="/shoes"
            element={
              <ProductOne
                priceFilter={priceFilter}
                location="shoes"
                Products={product}
                search={search}
                sortBy={sortBy}
                errors={errors}
              />
            }
          />
        </Route>
        <Route path="/permissions" element={<Permissions />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/supportusers" element={<SupportUsers />} />
        <Route path="/supportchat" element={<SupportChat />} />
        <Route path="/mytickets" element={<MyTickets />} />
        <Route element={<IsValid locate={"Users"} />}>
          <Route path="/users" element={<Users />} />
        </Route>
        <Route
          path="/cart"
          element={<Cart search={search} sortBy={sortBy} />}
        />
      </Routes>
    </>
  );
}

export default App;
