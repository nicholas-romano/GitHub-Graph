import { API } from "../data/constants";

async function fetchGitHubData(path, signal) {
  const res = await fetch(`${API}${path}`, {
    headers: { Accept: "application/vnd.github+json" },
    signal,
  });
  if (res.status === 404) throw new Error("User not found.");
  if (res.status === 403 || res.status === 429) {
    throw new Error(
      "GitHub API rate limit reached (60 requests/hour without a token). Try again later.",
    );
  }
  if (!res.ok) throw new Error(`GitHub API error (${res.status}).`);
  return res.json();
}

export default fetchGitHubData;
