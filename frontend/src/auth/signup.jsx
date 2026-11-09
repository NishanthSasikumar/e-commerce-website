import { Input, Button, Form, Card } from "antd";
import { withSuccess } from "antd/es/modal/confirm";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setRole } from "../slicers";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [val, setVal] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
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
            "http://localhost:3000/auth/signup",
            val
        );
        console.log(postResponse.data);
        
        if (postResponse.data.success) {
            // setRole(postResponse.data.role);
            navigate("/");
        }
    } catch (error) {
      console.log("HI");
      
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
        <h2 style={{ textAlign: "center" }}>Signup</h2>

        <Form layout="vertical" onFinish={postCall}>
          <Form.Item
            label="Name"
            rules={[
              {
                required: true,
                message: "Please enter name",
              },
            ]}
          >
            <Input
              placeholder="Enter Name"
              name="name"
              value={val.name}
              onChange={handleValue}
            />
          </Form.Item>

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

          <Form.Item
            label="Confirm Password"
            rules={[
              {
                required: true,
                message: "Please enter confirmpassword",
              },
            ]}
          >
            <Input
              placeholder="Confirm Password"
              name="confirmPassword"
              value={val.confirmPassword}
              onChange={handleValue}
            />
          </Form.Item>

          <div className="align">

          <Button type="primary" htmlType="submit">
            Signup
          </Button>
          <p> Already have an account? <Link to="/login">login</Link></p>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Signup;
