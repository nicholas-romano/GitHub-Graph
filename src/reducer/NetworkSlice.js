import { createSlice } from "@reduxjs/toolkit";
import { getUserData } from "../async/getUserData";
import { fetchProfileData } from "../async/fetchProfileData";

export const networkSlice = createSlice({
  name: "network",
  initialState: {
    query: "",
    status: "idle", // idle | loading
    error: null,
    graph: null, // { nodes, links }
    hoveredId: null,
    selectedId: null,
    profiles: {}, // login -> full GitHub profile
    profileStatus: {}, // login -> idle | loading
    profileError: {}, // login -> message
  },
  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
    },
    setHovered(state, action) {
      state.hoveredId = action.payload;
    },
    selectNode(state, action) {
      state.selectedId = action.payload;
    },
    closeModal(state) {
      state.selectedId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getUserData.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.graph = { nodes: payload.nodes, links: payload.links };
        state.profiles[payload.user.login] = payload.user;
        state.hoveredId = null;
        state.selectedId = null;
      })
      .addCase(getUserData.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.status = "idle";
        state.error = action.error.message || "Something went wrong.";
      })
      .addCase(fetchProfileData.pending, (state, action) => {
        const login = action.meta.arg;
        state.profileStatus[login] = "loading";
        delete state.profileError[login];
      })
      .addCase(fetchProfileData.fulfilled, (state, action) => {
        const login = action.meta.arg;
        state.profileStatus[login] = "idle";
        state.profiles[login] = action.payload;
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        const login = action.meta.arg;
        state.profileStatus[login] = "idle";
        state.profileError[login] =
          action.error.message || "Could not load profile.";
      });
  },
});
