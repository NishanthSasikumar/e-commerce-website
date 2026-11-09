import { Input, Button, Form, Card, message } from "antd";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setId, setRole } from "../slicers";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [val, setVal] = useState({
    email: "",
    password: "",
  });

  const handleValue = (e) => {
    const { name, value } = e.target;

    setVal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const postCall = async () => {
    try {
      const postResponse = await axios.post(
        "http://localhost:3000/auth/login",
        val,
        { withCredentials: true },
      );
      console.log(postResponse.data);

      dispatch(
        setRole({
          role: postResponse.data.role,
          id: postResponse.data.id,
          email: postResponse.data.email,
          permission : []
        }),
      );
      navigate("/");
    } catch (error) {
      message.error("Account has been deactivated");
      console.log(error);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card style={{ width: 450 }}>
        <h2 style={{ textAlign: "center" }}>Login</h2>

        <Form layout="vertical" onFinish={postCall}>
          <Form.Item
            label="Email"
            rules={[
              {
                required: true,
                message: "Please enter email",
              },
            ]}
          >
            <Input
              placeholder="Enter Email"
              name="email"
              value={val.email}
              onChange={handleValue}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            rules={[
              {
                required: true,
                message: "Please enter password",
              },
            ]}
          >
            <Input
              placeholder="Enter Password"
              name="password"
              value={val.password}
              onChange={handleValue}
            />
          </Form.Item>

          <div className="align">
            <Button type="primary" htmlType="submit">
              Login
            </Button>
            <p>
              Don't have an account? <Link to="/signup">signup</Link>
            </p>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
