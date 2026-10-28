const API = process.env.REACT_APP_API_URL || ""; // "" = same origin
const PER_PAGE = 12; // followers and following fetched per search (max 100)
const MAX_LABEL = 14; // longer usernames are truncated inside the circle
const FONT = "600 13px system-ui, sans-serif";
const PADDING = 10; // space between the text and the circle edge

export { API, PER_PAGE, MAX_LABEL, FONT, PADDING };
