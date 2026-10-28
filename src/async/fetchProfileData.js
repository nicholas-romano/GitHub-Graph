import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchGitHubData from "./fetchGitHubData";

// The followers/following lists don't include bio or location,
// so the full profile is fetched when a node is opened (and cached in the store).
export const fetchProfileData = createAsyncThunk(
  "network/fetchProfileData",
  (login, { signal }) =>
    fetchGitHubData(`/api/users/${encodeURIComponent(login)}`, signal),
  {
    condition: (login, { getState }) => {
      const { profiles, profileStatus } = getState().network;
      return !profiles[login] && profileStatus[login] !== "loading";
    },
  },
);
