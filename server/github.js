const API = "https://api.github.com";
const USERNAME_RE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
const TTL = 5 * 60 * 1000; // cache entries live 5 minutes

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function fetchGitHubData(path) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "github-graph",
  };
  if (process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const res = await fetch(`${API}${path}`, { headers });
  if (res.status === 404) throw new HttpError(404, "User not found.");
  if (res.status === 403 || res.status === 429) {
    throw new HttpError(429, "GitHub API rate limit reached. Try again later.");
  }
  if (!res.ok) throw new HttpError(502, `GitHub API error (${res.status}).`);
  return res.json();
}

const cache = new Map();
async function cached(key, load) {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;
  const value = await load();
  cache.set(key, { value, expires: Date.now() + TTL });
  return value;
}

function assertUsername(username) {
  if (!USERNAME_RE.test(username))
    throw new HttpError(400, "Invalid GitHub username.");
}

export function getProfile(username) {
  assertUsername(username);
  return cached(`profile:${username.toLowerCase()}`, async () => {
    const u = await fetchGitHubData(`/users/${username}`);
    return {
      login: u.login,
      avatar_url: u.avatar_url,
      html_url: u.html_url,
      bio: u.bio,
      location: u.location,
    };
  });
}

export function getNetwork(username, perPage = 12) {
  assertUsername(username);
  const n = Math.min(Math.max(Number(perPage) || 12, 1), 100);

  return cached(`network:${username.toLowerCase()}:${n}`, async () => {
    const [user, followers, following] = await Promise.all([
      getProfile(username),
      fetchGitHubData(`/users/${username}/followers?per_page=${n}`),
      fetchGitHubData(`/users/${username}/following?per_page=${n}`),
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
      .filter((x) => x.type !== "main")
      .map((x) => ({ source: user.login, target: x.id }));
    return { nodes, links, user };
  });
}
