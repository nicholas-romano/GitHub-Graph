import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "styled-components";
import { Svg } from "../styles/styles";
import * as d3 from "d3";
import { networkSlice } from "../reducer/NetworkSlice";

import { FONT, MAX_LABEL, PADDING } from "../data/constants";

function Graph({ width, height }) {
  const { setHovered, selectNode } = networkSlice.actions;
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const graph = useSelector((s) => s.network.graph);
  const hoveredId = useSelector((s) => s.network.hoveredId);
  const svgRef = useRef(null);

  // Build the force simulation whenever a new graph arrives.
  useEffect(() => {
    // Redux state is frozen, and D3 mutates its data, so work on copies.
    const nodes = graph.nodes.map((d) => ({ ...d }));
    const links = graph.links.map((d) => ({ ...d }));

    // Size each circle to enclose its (possibly truncated) label.
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.font = FONT;
    nodes.forEach((d) => {
      d.label =
        d.id.length > MAX_LABEL ? `${d.id.slice(0, MAX_LABEL - 1)}…` : d.id;
      d.r =
        Math.ceil(ctx.measureText(d.label).width / 2) +
        PADDING +
        (d.type === "main" ? 6 : 0);
      if (d.type === "main") {
        d.fx = width / 2;
        d.fy = height / 2;
      }
    });

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(150),
      )
      .force("charge", d3.forceManyBody().strength(-320))
      .force(
        "collide",
        d3.forceCollide((d) => d.r + 6),
      );

    const link = svg
      .append("g")
      .attr("stroke", "#9aa0a6")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("class", "link")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5);

    const node = svg
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .attr("tabindex", 0)
      .attr("role", "button")
      .attr("aria-label", (d) => `Open ${d.id}'s GitHub profile`)
      .style("cursor", "pointer")
      .style("outline", "none")
      .on("mouseenter", (_, d) => dispatch(setHovered(d.id)))
      .on("mouseleave", () => dispatch(setHovered(null)))
      .on("click", (_, d) => dispatch(selectNode(d.id)))
      .on("keydown", (e, d) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          dispatch(selectNode(d.id));
        }
      });

    node.append("title").text((d) => d.id);

    node
      .append("circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d) => colors[d.type])
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    node
      .append("text")
      .text((d) => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "#fff")
      .style("font", FONT)
      .style("pointer-events", "none")
      .style("user-select", "none");

    // d3-drag suppresses the click after a real drag, so dragging won't open the modal.
    node.call(
      d3
        .drag()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          // The searched user stays pinned to the center.
          d.fx = d.type === "main" ? width / 2 : null;
          d.fy = d.type === "main" ? height / 2 : null;
        }),
    );

    simulation.on("tick", () => {
      nodes.forEach((d) => {
        d.x = Math.max(d.r + 2, Math.min(width - d.r - 2, d.x));
        d.y = Math.max(d.r + 2, Math.min(height - d.r - 2, d.y));
      });

      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [graph, width, height, colors, dispatch, setHovered, selectNode]);

  // Dim everything except the hovered node and its neighbors (hoveredId lives in Redux).
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const neighbors = new Set();
    if (hoveredId) {
      neighbors.add(hoveredId);
      graph.links.forEach((l) => {
        if (l.source === hoveredId) neighbors.add(l.target);
        if (l.target === hoveredId) neighbors.add(l.source);
      });
    }
    svg
      .selectAll(".node")
      .attr("opacity", (d) => (!hoveredId || neighbors.has(d.id) ? 1 : 0.25));
    svg
      .selectAll(".link")
      .attr("stroke-opacity", (d) =>
        !hoveredId || d.source.id === hoveredId || d.target.id === hoveredId
          ? 0.8
          : 0.1,
      );
  }, [hoveredId, graph]);

  return (
    <Svg
      ref={svgRef}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    />
  );
}

export default Graph;
