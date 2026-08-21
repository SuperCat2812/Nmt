'use client';

import { useEffect, useId, useRef } from 'react';

import JXG from 'jsxgraph';

import { compile } from 'mathjs';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { FunctionVisual, Visual } from '@/types/visual';

// ========================================
// FUNCTION GRAPH
// ========================================

function FunctionGraph({ visual }: { visual: FunctionVisual }) {
  const id = useId().replaceAll(':', '');

  const containerId = `jxg-${id}`;

  const boardRef = useRef<ReturnType<typeof JXG.JSXGraph.initBoard> | null>(
    null,
  );

  useEffect(() => {
    const compiled = compile(visual.expression);

    const fn = (x: number) => {
      const result = compiled.evaluate({
        x,
      });

      return Number(result);
    };

    const board = JXG.JSXGraph.initBoard(containerId, {
      boundingbox: [
        visual.xMin ?? -10,

        visual.yMax ?? 10,

        visual.xMax ?? 10,

        visual.yMin ?? -10,
      ],

      axis: true,

      showNavigation: false,

      showCopyright: false,

      keepAspectRatio: false,
    });

    board.create('functiongraph', [fn, visual.xMin ?? -10, visual.xMax ?? 10]);

    boardRef.current = board;

    return () => {
      if (boardRef.current) {
        JXG.JSXGraph.freeBoard(boardRef.current);

        boardRef.current = null;
      }
    };
  }, [containerId, visual]);

  return (
    <div
      id={containerId}
      style={{
        width: '100%',

        maxWidth: 600,

        height: 400,
      }}
    />
  );
}

// ========================================
// MAIN RENDERER
// ========================================

type Props = {
  visual: Visual;
};

export default function VisualRenderer({ visual }: Props) {
  switch (visual.type) {
    case 'table':
      return (
        <table>
          <thead>
            <tr>
              {visual.headers.map((header, index) => (
                <th key={`${header}-${index}`}>{header}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {visual.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((value, columnIndex) => (
                  <td key={columnIndex}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );

    case 'bar-chart':
      return (
        <div
          style={{
            width: '100%',

            height: 320,
          }}
        >
          <ResponsiveContainer>
            <BarChart data={visual.data}>
              <CartesianGrid />

              <XAxis
                dataKey="label"
                label={
                  visual.xLabel
                    ? {
                        value: visual.xLabel,

                        position: 'insideBottom',

                        offset: -5,
                      }
                    : undefined
                }
              />

              <YAxis
                label={
                  visual.yLabel
                    ? {
                        value: visual.yLabel,

                        angle: -90,

                        position: 'insideLeft',
                      }
                    : undefined
                }
              />

              <Tooltip />

              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );

    case 'function':
      return <FunctionGraph visual={visual} />;

    case 'geometry2d':
      return (
        <svg width="400" height="300" viewBox="0 0 400 300">
          {visual.segments.map((segment, index) => {
            const from = visual.points.find(
              (point) => point.id === segment.from,
            );

            const to = visual.points.find((point) => point.id === segment.to);

            if (!from || !to) {
              return null;
            }

            return (
              <line
                key={index}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="currentColor"
              />
            );
          })}

          {visual.points.map((point) => (
            <g key={point.id}>
              <circle cx={point.x} cy={point.y} r="3" fill="currentColor" />

              {point.label && (
                <text x={point.x + 6} y={point.y - 6}>
                  {point.label}
                </text>
              )}
            </g>
          ))}
        </svg>
      );
  }
}
