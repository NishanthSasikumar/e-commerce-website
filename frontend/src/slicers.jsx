import { createSlice } from "@reduxjs/toolkit";
import {
  countThunk,
  getUserThunk,
  roleThunk,
  toggleBlockThunk,
} from "./thunks";
import { message } from "antd";

const userSlice = createSlice({
  name: "user",
  initialState: [],
  reducers: {
    updateUserRole: (state, action) => {
      const { email, role } = action.payload;
      return state.map((user) =>
        user.email === email ? { ...user, role } : user,
      );
    },
    updateUserBlock: (state, action) => {
      const { id, isBlocked } = action.payload;
      return state.map((user) =>
        user._id === id ? { ...user, isBlocked } : user,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserThunk.fulfilled, (state, action) => {
        return action?.payload;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        console.log("getUserThunk", action?.error);
      })
      .addCase(toggleBlockThunk.fulfilled, (state, action) => {
        const { id, block } = action?.payload;
        const updateBlock = state.map((user) =>
          user?._id === id ? { ...user, isBlocked: block } : user,
        );
        message.success("Status updated");
        return updateBlock;
      })
      .addCase(toggleBlockThunk.rejected, (state, action) => {
        console.log(action);
        message.error("Unable to update status");
      });
  },
});

const roleSlice = createSlice({
  name: "role",
  initialState: {
    role: "",
    permission: [],
    userId: "",
    email: "",
  },
  reducers: {
    resetRole: (state, action) => {
      return { role: "", permission: [], userId: "", email: "" };
    },
    setRole: (state, action) => {
      return action?.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(roleThunk.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(roleThunk.rejected, (state, action) => {
        console.log("Failed to fetch role");
      });
  },
});

const countSlice = createSlice({
  name: "count",
  initialState: 0,
  reducers: {
    increaseCount: (state, action) => action?.payload,
    decreaseCount: (state, action) => action?.payload,
  },
  extraReducers: (builder) => {
    builder
      .addCase(countThunk.fulfilled, (state, action) => action?.payload)
      .addCase(countThunk.rejected, () => console.log("Failed to set count"));
  },
});

const currentUserSlicer = createSlice({
  name: "userId",
  initialState: "",
  reducers: {
    setId: (state, action) => action.payload,
  },
});

const ticketNoSlicer = createSlice({
  name: "ticketNo",
  initialState: "",
  reducers: {
    setTicketNo: (state, action) => action.payload,
  },
});

export const { increaseCount, decreaseCount } = countSlice.actions;
export const { resetRole, setRole } = roleSlice.actions;
export const { updateUserRole, updateUserBlock } = userSlice.actions;
export const { setId } = currentUserSlicer.actions;
export const { setTicketNo } = ticketNoSlicer.actions;

export const userReducer = userSlice.reducer;
export const roleReducer = roleSlice.reducer;
export const countReducer = countSlice.reducer;
export const currentUserReducer = currentUserSlicer.reducer;
export const ticketNoReducer = ticketNoSlicer.reducer;
