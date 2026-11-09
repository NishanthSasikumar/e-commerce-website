import axios from "axios";
import pages from "../pages.json";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, message, Modal, Table, Checkbox } from "antd";

const Permissions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  
  

  const columns = [
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },

    ...pages.map((page) => ({
      title: page.label,
      key: page.label,

      render: (_, record) => (
        <Checkbox
          checked={record.permission?.includes(page.label)}
          onChange={() => handlePermission(record._id, page.label)}
        />
      ),
    })),
  ];
  const handlePermission = async (roleId, page) => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/role/updatepermission",
        {
          roleId,
          page,
        },
      );

      if (response.data.success) {
        const updatedRole = response.data.role;

        setRoles((prev) =>
          prev.map((role) =>
            role._id === updatedRole._id ? updatedRole : role,
          ),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/role/getrole");

      if (response.data.success) {
        setRoles(response.data.roles);
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch roles");
    }
  };

  const handleAddRole = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/role/createrole",
        {
          role,
        },
      );

      if (response.data.success) {
        message.success(response.data.message);
        setRole("");
        setIsModalOpen(false);
      }
    } catch (error) {
      message.error("Error creating role");
    }
  };

  useEffect(() => {
    
    fetchRoles();
  }, []);

  return (
    <>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add Role
      </Button>

      <Modal
        title="Create Role"
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setRole("");
          setIsModalOpen(false);
        }}
      >
        <Input
          placeholder="Enter Role Name"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <Button
          type="primary"
          style={{ marginTop: "10px" }}
          onClick={handleAddRole}
        >
          Add
        </Button>
      </Modal>
      <Table columns={columns} dataSource={roles} />
    </>
  );
};

export default Permissions;
