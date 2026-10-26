import "./App.css";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { store } from "./reducer/store";
import { theme } from "./styles/theme";
import NetworkApp from "./components/NetworkApp";

export default function App({ width = 720, height = 520 }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <NetworkApp width={width} height={height} />
      </ThemeProvider>
    </Provider>
  );
}
