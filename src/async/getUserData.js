import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchGitHubData from "./fetchGitHubData";
import { PER_PAGE } from "../data/constants";

// Each search uses 3 API requests.
export const getUserData = createAsyncThunk(
  "network/getUserData",
  async (username, { signal }) => {
    const name = encodeURIComponent(username);
    const [user, followers, following] = await Promise.all([
      fetchGitHubData(`/users/${name}`, signal),
      fetchGitHubData(`/users/${name}/followers?per_page=${PER_PAGE}`, signal),
      fetchGitHubData(`/users/${name}/following?per_page=${PER_PAGE}`, signal),
    ]);

    const byLogin = new Map();
    const slim = (u, type) => ({
      id: u.login,
      type,
      avatar_url: u.avatar_url,
      html_url: u.html_url,
    });

    byLogin.set(user.login, slim(user, "main"));
    followers.forEach((u) => {
      if (!byLogin.has(u.login)) byLogin.set(u.login, slim(u, "follower"));
    });
    following.forEach((u) => {
      const existing = byLogin.get(u.login);
      if (!existing) byLogin.set(u.login, slim(u, "following"));
      else if (existing.type === "follower") existing.type = "mutual";
    });

    const nodes = [...byLogin.values()];
    const links = nodes
      .filter((n) => n.type !== "main")
      .map((n) => ({ source: user.login, target: n.id }));
    return { nodes, links, user };
  },
);
