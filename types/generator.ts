export type NumberRange = readonly [min: number, max: number];

export type LinearEquationForm = 'ax+b=c' | 'ax=b' | 'a(x+b)=c' | 'ax+b=cx+d';

export interface LinearEquationConfig {
  answerRange: NumberRange;
  coefficientRange: NumberRange;
  constantRange: NumberRange;
  forms: readonly LinearEquationForm[];
}

export type PercentageForm =
  | 'percent-of-number'
  | 'number-by-percent'
  | 'percentage-ratio'
  | 'increase-by-percent'
  | 'decrease-by-percent'
  | 'percentage-change'
  | 'successive-change';

export interface PercentageConfig {
  numberRange: NumberRange;
  percentValues: readonly number[];
  forms: readonly PercentageForm[];
}

export type FractionForm =
  | 'reduce'
  | 'compare'
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide';
export interface FractionConfig {
  numeratorRange: NumberRange;
  denominatorRange: NumberRange;
  forms: readonly FractionForm[];
  allowNegative: boolean;
  allowImproper: boolean;
}

export type PowerRootForm =
  | 'power-value'
  | 'multiply-same-base'
  | 'divide-same-base'
  | 'power-of-power'
  | 'square-root'
  | 'cube-root'
  | 'simplify-square-root';

export interface PowerRootConfig {
  baseRange: NumberRange;
  exponentRange: NumberRange;

  forms: readonly PowerRootForm[];

  allowNegativeBase: boolean;
}

export type QuadraticEquationForm = 'two-roots' | 'double-root';

export interface QuadraticEquationConfig {
  rootRange: NumberRange;

  forms: readonly QuadraticEquationForm[];
}

// ========================================
// ALGEBRAIC EXPRESSIONS
// ========================================

export type ExpressionForm =
  | 'expand-brackets'
  | 'combine-like-terms'
  | 'factor-common'
  | 'difference-of-squares';

export interface ExpressionConfig {
  coefficientRange: NumberRange;
  constantRange: NumberRange;

  forms: readonly ExpressionForm[];
}

// ========================================
// RATIONAL EQUATIONS
// ========================================

export type RationalEquationForm = 'a-over-x-minus-b' | 'linear-fraction';

export interface RationalEquationConfig {
  answerRange: NumberRange;
  coefficientRange: NumberRange;
  constantRange: NumberRange;

  forms: readonly RationalEquationForm[];
}

// ========================================
// INEQUALITIES
// ========================================

export type InequalityForm = 'linear' | 'quadratic' | 'system-linear';

export interface InequalityConfig {
  rootRange: NumberRange;
  coefficientRange: NumberRange;
  constantRange: NumberRange;

  forms: readonly InequalityForm[];
}

// ========================================
// FUNCTIONS
// ========================================

export type FunctionForm = 'value' | 'zeros' | 'vertex' | 'graph-value';

export interface FunctionConfig {
  xRange: NumberRange;
  coefficientRange: NumberRange;
  constantRange: NumberRange;

  forms: readonly FunctionForm[];
}

// ========================================
// TRIGONOMETRY
// ========================================

export type TrigonometryForm =
  | 'standard-value'
  | 'basic-equation'
  | 'identity'
  | 'right-triangle';

export interface TrigonometryConfig {
  forms: readonly TrigonometryForm[];
}

// ========================================
// VECTORS
// ========================================

export type VectorForm =
  | 'coordinates-2d'
  | 'coordinates-3d'
  | 'length-2d'
  | 'dot-product';

export interface VectorConfig {
  coordinateRange: NumberRange;
  forms: readonly VectorForm[];
}

// ========================================
// COMBINATORICS
// ========================================

export type CombinatoricsForm = 'permutation' | 'combination' | 'arrangement';

export interface CombinatoricsConfig {
  nRange: NumberRange;
  forms: readonly CombinatoricsForm[];
}

// ========================================
// PROBABILITY
// ========================================

export type ProbabilityForm = 'classical' | 'complement' | 'independent-events';

export interface ProbabilityConfig {
  countRange: NumberRange;
  forms: readonly ProbabilityForm[];
}

// ========================================
// STATISTICS
// ========================================

export type StatisticsForm = 'mean' | 'median' | 'mode' | 'range' | 'bar-chart';

export interface StatisticsConfig {
  valueRange: NumberRange;
  itemCountRange: NumberRange;
  forms: readonly StatisticsForm[];
}

// ========================================
// GEOMETRY 2D
// ========================================

export type Geometry2DForm =
  | 'rectangle-area'
  | 'triangle-area'
  | 'circle-area'
  | 'pythagorean';

export interface Geometry2DConfig {
  lengthRange: NumberRange;
  forms: readonly Geometry2DForm[];
}

// ========================================
// SEQUENCES
// ========================================

export type SequenceForm =
  | 'arithmetic-next'
  | 'arithmetic-nth'
  | 'arithmetic-sum'
  | 'geometric-next'
  | 'geometric-nth'
  | 'geometric-sum';

export interface SequenceConfig {
  startRange: NumberRange;
  differenceRange: NumberRange;
  ratioRange: NumberRange;
  nRange: NumberRange;

  forms: readonly SequenceForm[];
}

// ========================================
// ADVANCED EQUATIONS
// ========================================

export type AdvancedEquationForm =
  | 'exponential'
  | 'irrational'
  | 'logarithmic-shift';

export interface AdvancedEquationConfig {
  answerRange: NumberRange;
  baseRange: NumberRange;
  constantRange: NumberRange;

  forms: readonly AdvancedEquationForm[];
}

// ========================================
// EXTENDED GEOMETRY 2D
// ========================================

export type Geometry2DExtendedForm =
  | 'trapezoid-area'
  | 'parallelogram-area'
  | 'rhombus-area'
  | 'circumference'
  | 'arc-length'
  | 'sector-area'
  | 'distance-between-points';

export interface Geometry2DExtendedConfig {
  lengthRange: NumberRange;
  coordinateRange: NumberRange;

  forms: readonly Geometry2DExtendedForm[];
}

// ========================================
// GEOMETRY 3D
// ========================================

export type Geometry3DForm =
  | 'rectangular-prism-volume'
  | 'prism-volume'
  | 'pyramid-volume'
  | 'cylinder-volume'
  | 'cone-volume'
  | 'sphere-volume'
  | 'sphere-surface';

export interface Geometry3DConfig {
  lengthRange: NumberRange;

  forms: readonly Geometry3DForm[];
}

// ========================================
// CALCULUS
// ========================================

export type CalculusForm =
  | 'limit-polynomial'
  | 'derivative-at-point'
  | 'tangent-slope'
  | 'indefinite-integral-monomial'
  | 'definite-integral-monomial';

export interface CalculusConfig {
  coefficientRange: NumberRange;
  powerRange: NumberRange;
  xRange: NumberRange;

  forms: readonly CalculusForm[];
}

// ========================================
// LINEAR ALGEBRA
// ========================================

export type LinearAlgebraForm =
  | 'matrix-addition'
  | 'matrix-multiplication'
  | 'determinant-2x2'
  | 'linear-system-2x2'
  | 'vector-linear-combination';

export interface LinearAlgebraConfig {
  valueRange: NumberRange;

  forms: readonly LinearAlgebraForm[];
}

// ========================================
// COMPLEX NUMBERS
// ========================================

export type ComplexNumberForm =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'modulus'
  | 'power-of-i';

export interface ComplexNumberConfig {
  valueRange: NumberRange;

  forms: readonly ComplexNumberForm[];
}

// ========================================
// DIFFERENTIAL EQUATIONS
// ========================================

export type DifferentialEquationForm =
  | 'constant-derivative'
  | 'linear-x-derivative'
  | 'exponential-general-solution';

export interface DifferentialEquationConfig {
  coefficientRange: NumberRange;
  initialValueRange: NumberRange;
  xRange: NumberRange;

  forms: readonly DifferentialEquationForm[];
}

// ========================================
// DISCRETE MATH
// ========================================

export type DiscreteMathForm =
  | 'set-union'
  | 'set-intersection'
  | 'set-cardinality'
  | 'logic-implication'
  | 'graph-handshake';

export interface DiscreteMathConfig {
  valueRange: NumberRange;

  forms: readonly DiscreteMathForm[];
}

// ========================================
// ADVANCED CALCULUS
// ========================================

export type AdvancedCalculusForm =
  | 'limit-factorization'
  | 'chain-rule'
  | 'product-rule'
  | 'quotient-rule'
  | 'extremum-quadratic'
  | 'substitution-integral';

export interface AdvancedCalculusConfig {
  coefficientRange: NumberRange;
  xRange: NumberRange;
  powerRange: NumberRange;

  forms: readonly AdvancedCalculusForm[];
}

// ========================================
// ADVANCED LINEAR ALGEBRA
// ========================================

export type AdvancedLinearAlgebraForm =
  | 'determinant-3x3'
  | 'inverse-2x2'
  | 'rank-basic'
  | 'eigenvalues-diagonal'
  | 'eigenvector-diagonal';

export interface AdvancedLinearAlgebraConfig {
  valueRange: NumberRange;

  forms: readonly AdvancedLinearAlgebraForm[];
}

// ========================================
// SERIES
// ========================================

export type SeriesForm =
  | 'finite-arithmetic-sum'
  | 'finite-geometric-sum'
  | 'infinite-geometric-sum'
  | 'convergence-geometric'
  | 'taylor-basic';

export interface SeriesConfig {
  valueRange: NumberRange;
  nRange: NumberRange;

  forms: readonly SeriesForm[];
}

// ========================================
// NUMBER THEORY
// ========================================

export type NumberTheoryForm =
  | 'gcd'
  | 'lcm'
  | 'divisibility'
  | 'prime-check'
  | 'modular-remainder';

export interface NumberTheoryConfig {
  valueRange: NumberRange;

  forms: readonly NumberTheoryForm[];
}

// ========================================
// GRAPH THEORY
// ========================================

export type GraphTheoryForm =
  | 'complete-graph-edges'
  | 'tree-edges'
  | 'degree-sum'
  | 'cycle-vertices'
  | 'path-length';

export interface GraphTheoryConfig {
  vertexRange: NumberRange;

  forms: readonly GraphTheoryForm[];
}

// ========================================
// NUMERICAL METHODS
// ========================================

export type NumericalMethodForm =
  | 'bisection-step'
  | 'newton-step'
  | 'finite-difference'
  | 'trapezoid-rule';

export interface NumericalMethodConfig {
  xRange: NumberRange;

  forms: readonly NumericalMethodForm[];
}
