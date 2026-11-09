import { configureStore } from "@reduxjs/toolkit";
import { userReducer, roleReducer, countReducer, currentUserReducer, ticketNoReducer } from "./slicers";

const store = configureStore({
  reducer: {
    user: userReducer,
    role: roleReducer,
    count: countReducer,
    userId: currentUserReducer,
    ticketNo: ticketNoReducer,
  },
});

export default store;