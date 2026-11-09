import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Space, Tag, message, Select } from "antd";
import axios from "axios";
import { getUserThunk, toggleBlockThunk, toggleRoleThunk } from "../thunks";
import { updateUserBlock, updateUserRole } from "../slicers";
import { socket } from "../App";
import { useNavigate } from "react-router-dom";

function Users() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.user);

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    socket.on("role-updated", (data) => {
      dispatch(updateUserRole(data));
    });
    socket.on("user-blocked", (data) => {
      dispatch(updateUserBlock(data));
    });
    return () => {
      socket.off("role-updated");
      socket.off("user-blocked");
    };
  }, []);

  const handleRoleChange = async (email, roleId) => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/role/updaterole",
        {
          email,
          roleId,
        },
      );

      dispatch(
        updateUserRole({
          email,
          role: response.data.updatedUser.role,
        }),
      );

      message.success("Role updated successfully");
    } catch (error) {
      console.log(error);

      message.error("Unable to update role");
    }
  };
  const option = roles?.map((item) => ({
    label: item.role,
    value: item._id,
  }));

  const toggleBlock = async (id) => {
    try {
      dispatch(toggleBlockThunk(id));
    } catch (error) {
      message.error("Unable to update status");
    }
  };

  useEffect(() => {
    const getRoles = async () => {
      const response = await fetch("http://localhost:3000/role/getrole");
      const data = await response.json();
      setRoles(data.roles);
    };
    getRoles();

    dispatch(getUserThunk());
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      key: "email",
      render: (value, record) => <Tag>{record.email}</Tag>,
    },
    {
      title: "Role",
      key: "role",
      render: (_, record) => (
        <Select
          placeholder="Select a person"
          options={option}
          value={record?.role._id}
          disabled={record?.role.role === "superadmin" ? true : false}
          onChange={(value) => handleRoleChange(record.email, value)}
        />
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (value, record) =>
        record.isBlocked ? <Tag>Blocked</Tag> : <Tag>Active</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (value, record) => (
        <div>
          <Button
            disabled={record?.role.role === "superadmin" ? true : false}
            style={{ marginRight: "5px" }}
            onClick={() => toggleBlock(record._id)}
          >
            {record.isBlocked ? "Unblock" : "Block"}
          </Button>
        </div>
      ),
    },
  ];

  return <Table key="1" columns={columns} dataSource={users} />;
}

export default Users;
