'use client';

import { PostGraph, PostGraphLink, PostGraphNode } from '@types';
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceSimulation,
} from 'd3-force';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { useEffect, useMemo, useState } from 'react';

const ForceDirectedGraph = ({ postGraph }: { postGraph: PostGraph }) => {
  const { width, height, color, r } = useMemo(
    () => ({
      // Specify the dimensions of the chart.
      width: 900,
      height: 600,
      // Specify the color scale.
      color: scaleOrdinal(schemeCategory10),
      r: 8,
    }),
    [],
  );
  const [simulationNodes, setSimulationNodes] = useState<PostGraphNode[]>([]);
  const [simulationLinks, setSimulationLinks] = useState<PostGraphLink[]>([]);

  useEffect(() => {
    const forceLinkWithNodes = forceLink<PostGraphNode, PostGraphLink>(
      postGraph.links,
    ).id(d => d.wikilink);

    const simulation = forceSimulation<PostGraphNode>(postGraph.nodes)
      .force('link', forceLinkWithNodes)
      // .force('x', forceX(width / 2))
      // .force('y', forceY(height / 2))
      .force(
        'collide',
        forceCollide(Math.min(width, height) / (postGraph.nodes.length + 1)),
      )
      .force('center', forceCenter(width / 2, height / 2));

    simulation.on('tick', () => {
      setSimulationNodes([...simulation.nodes()]);
      setSimulationLinks([...forceLinkWithNodes.links()]);
    });

    return () => simulation.stop() as unknown as void;
  }, []);

  return (
    <svg
      className="max-w-full h-auto"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
    >
      <g stroke="black">
        <defs>
          <marker
            id="arrow"
            markerHeight="10"
            markerUnits="strokeWidth"
            markerWidth="10"
            orient="auto"
            refX="20"
            refY="6"
            viewBox="0 0 12 12"
          >
            <path d="M2,2 L10,6 L2,10 L6,6 L2,2"></path>
          </marker>
        </defs>
        {simulationLinks.map(({ source, target, index }) => {
          const sourceNode = source as PostGraphNode;
          const targetNode = target as PostGraphNode;
          return (
            <line
              key={index}
              markerEnd="url(#arrow)"
              strokeWidth={1}
              x1={sourceNode.x}
              x2={targetNode.x}
              y1={sourceNode.y}
              y2={targetNode.y}
            />
          );
        })}
      </g>
      <g stroke="#fff" strokeWidth={1.5}>
        {simulationNodes.map(node => (
          // <Tooltip content={node.title} key={node.wikilink}>
          //   <circle
          //     cx={node.x}
          //     cy={node.y}
          //     fill={color(node.slugIdx!.toString())}
          //     r={8}
          //   />
          // </Tooltip>
          <g
            key={node.wikilink}
            transform={` translate(${node.x}, ${node.y}) `}
          >
            <circle fill={color(node.slugIdx!.toString())} r={r} />
            <text
              dy={r * 2}
              style={{
                fill: 'black',
                fontSize: '8px',
                strokeWidth: 0,
              }}
              textAnchor="middle"
            >
              {node.title}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

export default ForceDirectedGraph;