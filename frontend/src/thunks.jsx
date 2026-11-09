import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setId } from "./slicers";

const getUserThunk = createAsyncThunk("getuser", async () => {
  try {
    const response = await axios.get("http://localhost:3000/users/get", {
      withCredentials: true,
    });
    return response?.data?.users;
  } catch (error) {
    throw new Error(error);
  }
});

const toggleRoleThunk = createAsyncThunk("togglerole", async (id) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/users/togglerole/${id}`,
      {},
      {
        withCredentials: true,
      },
    );
    return { id, userRole: response?.data?.role };
  } catch (error) {
    throw new Error(error);
  }
});

const toggleBlockThunk = createAsyncThunk("toggleBlock", async (id) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/users/toggleblock/${id}`,
      {},
      {
        withCredentials: true,
      },
    );
    console.log(response);
    
    return { id, block: response?.data?.isBlocked };
  } catch (error) {
    throw new Error(error);
  }
});

const roleThunk = createAsyncThunk("getrole", async () => {
  try {
    const response = await axios.get("http://localhost:3000/auth/role", {
      withCredentials: true,
    });
    console.log(response.data);
    return {
      role : response.data.role,
      permission : response.data.permission,
      userId : response.data.userId,
      email : response.data.email
    }
  } catch (error) {
    throw new Error(error);
  }
});

const countThunk = createAsyncThunk("getcount", async () => {
  try {
    const response = await axios.get("http://localhost:3000/cart/count", {
      withCredentials: true,
    });
    return response?.data?.count;
  } catch (error) {
    throw new Error(error);
  }
});

export {
  getUserThunk,
  toggleRoleThunk,
  toggleBlockThunk,
  roleThunk,
  countThunk,
};
