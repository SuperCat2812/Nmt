export interface BarChartVisual {
  type: 'bar-chart';
  data: {
    label: string;
    value: number;
  }[];
  xLabel?: string;
  yLabel?: string;
}

export interface FunctionVisual {
  type: 'function';
  expression: string;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
}

export interface GeometryPoint {
  id: string;
  x: number;
  y: number;
  label?: string;
}

export interface GeometrySegment {
  from: string;
  to: string;
  label?: string;
}

export interface Geometry2DVisual {
  type: 'geometry2d';
  points: GeometryPoint[];
  segments: GeometrySegment[];
}

export interface TableVisual {
  type: 'table';
  headers: string[];
  rows: Array<Array<string | number>>;
}

export type Visual =
  | BarChartVisual
  | FunctionVisual
  | Geometry2DVisual
  | TableVisual;
