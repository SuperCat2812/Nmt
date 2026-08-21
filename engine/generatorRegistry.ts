import type { Question } from '@/types/question';

import type {
  AdvancedCalculusConfig,
  AdvancedEquationConfig,
  AdvancedLinearAlgebraConfig,
  CalculusConfig,
  CombinatoricsConfig,
  ComplexNumberConfig,
  DifferentialEquationConfig,
  DiscreteMathConfig,
  ExpressionConfig,
  FractionConfig,
  FunctionConfig,
  Geometry2DConfig,
  Geometry2DExtendedConfig,
  Geometry3DConfig,
  GraphTheoryConfig,
  InequalityConfig,
  LinearAlgebraConfig,
  LinearEquationConfig,
  NumberTheoryConfig,
  NumericalMethodConfig,
  PercentageConfig,
  PowerRootConfig,
  ProbabilityConfig,
  QuadraticEquationConfig,
  RationalEquationConfig,
  SequenceConfig,
  SeriesConfig,
  StatisticsConfig,
  TrigonometryConfig,
  VectorConfig,
} from '@/types/generator';

import { generateFraction } from '@/generators/fractions/fractionGenerator';

import { generatePowerRoot } from '@/generators/powersRoots/powerRootGenerator';

import { generateExpression } from '@/generators/expressions/expressionGenerator';

import { generateLinearEquation } from '@/generators/equations/linearEquation';

import { generateQuadraticEquation } from '@/generators/equations/quadraticEquation';

import { generateRationalEquation } from '@/generators/equations/rationalEquation';

import { generateAdvancedEquation } from '@/generators/equations/advancedEquation';

import { generateInequality } from '@/generators/inequalities/inequalityGenerator';

import { generateFunction } from '@/generators/functions/functionGenerator';

import { generatePercentage } from '@/generators/percentages/percentageGenerator';

import { generateLogarithmEquation } from '@/generators/logarithms/logarithmEquation';

import { generateTrigonometry } from '@/generators/trigonometry/trigonometryGenerator';

import { generateVector } from '@/generators/vectors/vectorGenerator';

import { generateCombinatorics } from '@/generators/combinatorics/combinatoricsGenerator';

import { generateProbability } from '@/generators/probability/probabilityGenerator';

import { generateStatistics } from '@/generators/statistics/statisticsGenerator';

import { generateGeometry2D } from '@/generators/geometry/geometry2DGenerator';

import { generateGeometry2DExtended } from '@/generators/geometry/geometry2DExtendedGenerator';

import { generateGeometry3D } from '@/generators/geometry/geometry3DGenerator';

import { generateSequence } from '@/generators/sequences/sequenceGenerator';

import { generateCalculus } from '@/generators/calculus/calculusGenerator';

import { generateAdvancedCalculus } from '@/generators/advancedCalculus/advancedCalculusGenerator';

import { generateLinearAlgebra } from '@/generators/linearAlgebra/linearAlgebraGenerator';

import { generateAdvancedLinearAlgebra } from '@/generators/advancedLinearAlgebra/advancedLinearAlgebraGenerator';

import { generateComplexNumber } from '@/generators/complexNumbers/complexNumberGenerator';

import { generateDifferentialEquation } from '@/generators/differentialEquations/differentialEquationGenerator';

import { generateDiscreteMath } from '@/generators/discreteMath/discreteMathGenerator';

import { generateSeries } from '@/generators/series/seriesGenerator';

import { generateNumberTheory } from '@/generators/numberTheory/numberTheoryGenerator';

import { generateGraphTheory } from '@/generators/graphTheory/graphTheoryGenerator';

import { generateNumericalMethod } from '@/generators/numericalMethods/numericalMethodGenerator';

export type GeneratorConfig =
  | FractionConfig
  | PowerRootConfig
  | ExpressionConfig
  | LinearEquationConfig
  | QuadraticEquationConfig
  | RationalEquationConfig
  | AdvancedEquationConfig
  | InequalityConfig
  | FunctionConfig
  | PercentageConfig
  | TrigonometryConfig
  | VectorConfig
  | CombinatoricsConfig
  | ProbabilityConfig
  | StatisticsConfig
  | Geometry2DConfig
  | Geometry2DExtendedConfig
  | Geometry3DConfig
  | SequenceConfig
  | CalculusConfig
  | AdvancedCalculusConfig
  | LinearAlgebraConfig
  | AdvancedLinearAlgebraConfig
  | ComplexNumberConfig
  | DifferentialEquationConfig
  | DiscreteMathConfig
  | SeriesConfig
  | NumberTheoryConfig
  | GraphTheoryConfig
  | NumericalMethodConfig;

export type QuestionGenerator = (config: Record<string, unknown>) => Question;

export const generatorRegistry = {
  fraction: (config: Record<string, unknown>) =>
    generateFraction(config as unknown as FractionConfig),

  'powers-roots': (config: Record<string, unknown>) =>
    generatePowerRoot(config as unknown as PowerRootConfig),

  expressions: (config: Record<string, unknown>) =>
    generateExpression(config as unknown as ExpressionConfig),

  'linear-equation': (config: Record<string, unknown>) =>
    generateLinearEquation(config as unknown as LinearEquationConfig),

  'quadratic-equation': (config: Record<string, unknown>) =>
    generateQuadraticEquation(config as unknown as QuadraticEquationConfig),

  'rational-equation': (config: Record<string, unknown>) =>
    generateRationalEquation(config as unknown as RationalEquationConfig),

  'advanced-equation': (config: Record<string, unknown>) =>
    generateAdvancedEquation(config as unknown as AdvancedEquationConfig),

  inequality: (config: Record<string, unknown>) =>
    generateInequality(config as unknown as InequalityConfig),

  function: (config: Record<string, unknown>) =>
    generateFunction(config as unknown as FunctionConfig),

  percentage: (config: Record<string, unknown>) =>
    generatePercentage(config as unknown as PercentageConfig),

  'logarithm-equation': () => generateLogarithmEquation(),

  trigonometry: (config: Record<string, unknown>) =>
    generateTrigonometry(config as unknown as TrigonometryConfig),

  vector: (config: Record<string, unknown>) =>
    generateVector(config as unknown as VectorConfig),

  combinatorics: (config: Record<string, unknown>) =>
    generateCombinatorics(config as unknown as CombinatoricsConfig),

  probability: (config: Record<string, unknown>) =>
    generateProbability(config as unknown as ProbabilityConfig),

  statistics: (config: Record<string, unknown>) =>
    generateStatistics(config as unknown as StatisticsConfig),

  geometry2d: (config: Record<string, unknown>) =>
    generateGeometry2D(config as unknown as Geometry2DConfig),

  'geometry2d-extended': (config: Record<string, unknown>) =>
    generateGeometry2DExtended(config as unknown as Geometry2DExtendedConfig),

  geometry3d: (config: Record<string, unknown>) =>
    generateGeometry3D(config as unknown as Geometry3DConfig),

  sequence: (config: Record<string, unknown>) =>
    generateSequence(config as unknown as SequenceConfig),

  calculus: (config: Record<string, unknown>) =>
    generateCalculus(config as unknown as CalculusConfig),

  'advanced-calculus': (config: Record<string, unknown>) =>
    generateAdvancedCalculus(config as unknown as AdvancedCalculusConfig),

  'linear-algebra': (config: Record<string, unknown>) =>
    generateLinearAlgebra(config as unknown as LinearAlgebraConfig),

  'advanced-linear-algebra': (config: Record<string, unknown>) =>
    generateAdvancedLinearAlgebra(
      config as unknown as AdvancedLinearAlgebraConfig,
    ),

  'complex-number': (config: Record<string, unknown>) =>
    generateComplexNumber(config as unknown as ComplexNumberConfig),

  'differential-equation': (config: Record<string, unknown>) =>
    generateDifferentialEquation(
      config as unknown as DifferentialEquationConfig,
    ),

  'discrete-math': (config: Record<string, unknown>) =>
    generateDiscreteMath(config as unknown as DiscreteMathConfig),

  series: (config: Record<string, unknown>) =>
    generateSeries(config as unknown as SeriesConfig),

  'number-theory': (config: Record<string, unknown>) =>
    generateNumberTheory(config as unknown as NumberTheoryConfig),

  'graph-theory': (config: Record<string, unknown>) =>
    generateGraphTheory(config as unknown as GraphTheoryConfig),

  'numerical-method': (config: Record<string, unknown>) =>
    generateNumericalMethod(config as unknown as NumericalMethodConfig),
} satisfies Record<string, QuestionGenerator>;

export type GeneratorId = keyof typeof generatorRegistry;

export function isGeneratorId(id: string): id is GeneratorId {
  return id in generatorRegistry;
}

export function createGenerator(
  id: GeneratorId,
  config?: Record<string, unknown>,
): () => Question {
  const generator = generatorRegistry[id];

  return () => generator(config ?? {});
}
