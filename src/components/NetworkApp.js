import { useSelector } from "react-redux";
import { useTheme } from "styled-components";
import SearchBar from "./SearchBar";
import LEGEND from "../data/legend";
import {
  Page,
  ErrorText,
  Legend,
  LegendItem,
  Dot,
  Canvas,
  Empty,
  Hint,
  ContentWrapper,
  Content,
  Heading,
  Paragraph,
} from "../styles/styles";
import { PER_PAGE } from "../data/constants";
import Graph from "./Graph";
import UserModal from "./UserModal";

function NetworkApp({ width, height }) {
  const { colors } = useTheme();
  const error = useSelector((s) => s.network.error);
  const hasGraph = useSelector((s) => Boolean(s.network.graph));

  return (
    <ContentWrapper>
      <Content>
        <Heading>GitHub Graph</Heading>
        <Paragraph>
          Enter a GitHub username below and click the search button to view
          their network graph. When the graph is displayed, you can click on a
          username bubble to view their profile information. You can also click
          and drag the bubble around within the window.
        </Paragraph>
        <Page $width={width}>
          <SearchBar />
          {error && <ErrorText role="alert">{error}</ErrorText>}
          <Legend>
            {LEGEND.map(([type, label]) => (
              <LegendItem key={type}>
                <Dot $color={colors[type]} />
                {label}
              </LegendItem>
            ))}
          </Legend>
          <Canvas>
            {hasGraph ? (
              <Graph width={width} height={height} />
            ) : (
              <Empty>
                Enter a GitHub username and press Search to see their followers
                and the people they follow.
              </Empty>
            )}
          </Canvas>
          <Hint>
            Shows up to {PER_PAGE} followers and {PER_PAGE} followed users.
            Click a node for their profile. Drag to rearrange.
          </Hint>
          <UserModal />
        </Page>
      </Content>
    </ContentWrapper>
  );
}

export default NetworkApp;
