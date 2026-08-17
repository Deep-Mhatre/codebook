'use client';

import React, { useState } from 'react';
import { GitGraph } from 'lucide-react';

export interface GraphNode {
  id: string;
  label: string;
  type: 'topic' | 'page' | 'function' | 'class';
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
}

interface KnowledgeGraphViewProps {
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  onNodeSelect?: (nodeId: string) => void;
}

export function KnowledgeGraphView({
  nodes = [
    { id: 'n-1', label: 'Python Fundamentals', type: 'topic', x: 200, y: 150 },
    { id: 'n-2', label: 'Variables & Types', type: 'page', x: 100, y: 80 },
    { id: 'n-3', label: 'Control Flow', type: 'page', x: 300, y: 80 },
    { id: 'n-4', label: 'def calculate_total()', type: 'function', x: 100, y: 220 },
    { id: 'n-5', label: 'class DataPipeline', type: 'class', x: 300, y: 220 },
  ],
  edges = [
    { from: 'n-1', to: 'n-2' },
    { from: 'n-1', to: 'n-3' },
    { from: 'n-2', to: 'n-4' },
    { from: 'n-3', to: 'n-5' },
    { from: 'n-4', to: 'n-5' },
  ],
  onNodeSelect,
}: KnowledgeGraphViewProps) {
  const [activeNode, setActiveNode] = useState<GraphNode | null>(null);

  const getNodeColor = (type: GraphNode['type']) => {
    switch (type) {
      case 'topic': return '#f59e0b';
      case 'page': return '#3b82f6';
      case 'function': return '#10b981';
      case 'class': return '#a855f7';
      default: return '#6b7280';
    }
  };

  return (
    <div className="my-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-lg space-y-3 select-none">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 text-xs">
        <div className="flex items-center gap-2 font-semibold text-[var(--foreground)]">
          <GitGraph className="w-4 h-4 text-purple-500" />
          <span>Interactive 2D Concept & Symbol Knowledge Graph</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[var(--muted-foreground)]">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Topic</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Page</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Function</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Class</span>
        </div>
      </div>

      <div className="relative w-full h-[320px] bg-[var(--sidebar)] rounded-lg overflow-hidden border border-[var(--border)] flex items-center justify-center">
        <svg className="w-full h-full">
          {/* Render Graph Edges */}
          {edges.map((edge, idx) => {
            const source = nodes.find((n) => n.id === edge.from);
            const target = nodes.find((n) => n.id === edge.to);
            if (!source || !target) return null;

            return (
              <line
                key={idx}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="var(--border)"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            );
          })}

          {/* Render Graph Nodes */}
          {nodes.map((node) => {
            const color = getNodeColor(node.type);
            const isHovered = activeNode?.id === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => {
                  setActiveNode(node);
                  if (onNodeSelect) onNodeSelect(node.id);
                }}
                onMouseEnter={() => setActiveNode(node)}
                className="cursor-pointer transition-transform duration-150"
              >
                <circle
                  r={isHovered ? 16 : 12}
                  fill={color}
                  opacity={0.9}
                  className="transition-all duration-150 shadow-md"
                />
                <text
                  y={26}
                  textAnchor="middle"
                  fill="var(--foreground)"
                  fontSize="11"
                  fontWeight="500"
                  className="pointer-events-none"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
