import { configureStore } from "@reduxjs/toolkit";
import { networkSlice } from "./NetworkSlice";

export const store = configureStore({
  reducer: { network: networkSlice.reducer },
});
