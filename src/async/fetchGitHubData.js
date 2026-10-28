import { API } from "../data/constants";

async function fetchGitHubData(path, signal) {
  const res = await fetch(`${API}${path}`, { signal });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status}).`);
  }
  return res.json();
}

export default fetchGitHubData;
