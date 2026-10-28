import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchGitHubData from "./fetchGitHubData";
import { PER_PAGE } from "../data/constants";

export const getUserData = createAsyncThunk(
  "network/getUserData",
  (username, { signal }) =>
    fetchGitHubData(
      `/api/users/${encodeURIComponent(username)}/network?per_page=${PER_PAGE}`,
      signal,
    ),
);
