import { useDispatch, useSelector } from "react-redux";
import { networkSlice } from "../reducer/NetworkSlice";
import { getUserData } from "../async/getUserData";
import { Toolbar, Input, Button } from "../styles/styles";

function SearchBar() {
  const dispatch = useDispatch();
  const query = useSelector((s) => s.network.query);
  const loading = useSelector((s) => s.network.status === "loading");
  const username = query.trim().replace(/^@/, "");
  const disabled = loading || !username;
  const { setQuery } = networkSlice.actions;

  const search = () => {
    if (!disabled) dispatch(getUserData(username));
  };

  return (
    <Toolbar>
      <Input
        type="text"
        value={query}
        onChange={(e) => dispatch(setQuery(e.target.value))}
        onKeyDown={(e) => e.key === "Enter" && search()}
        placeholder="GitHub username"
        aria-label="GitHub username"
        autoComplete="off"
        spellCheck={false}
      />
      <Button onClick={search} disabled={disabled}>
        {loading ? "Searching…" : "Search"}
      </Button>
    </Toolbar>
  );
}

export default SearchBar;
