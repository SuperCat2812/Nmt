import type {
  Course,
  GeneratorDefinition,
  TopicDefinition,
} from '@/types/course';

import { isGeneratorId } from './generatorRegistry';

type Range = readonly [number, number];

interface GeneratorRules {
  requiredConfig?: boolean;

  requiredFields?: string[];

  ranges?: string[];

  arrayFields?: string[];

  booleanFields?: string[];

  forms?: readonly string[];
}
function assertNoUnknownFields(
  value: Record<string, unknown>,
  allowedFields: readonly string[],
  path: string,
) {
  const allowed = new Set(allowedFields);

  for (const field of Object.keys(value)) {
    if (!allowed.has(field)) {
      throw new Error(`${path}: невідоме поле "${field}".`);
    }
  }
}

const generatorRules: Record<string, GeneratorRules> = {
  fraction: {
    requiredConfig: true,

    requiredFields: [
      'numeratorRange',
      'denominatorRange',
      'forms',
      'allowNegative',
      'allowImproper',
    ],

    ranges: ['numeratorRange', 'denominatorRange'],

    forms: ['reduce', 'compare', 'add', 'subtract', 'multiply', 'divide'],
    booleanFields: ['allowNegative', 'allowImproper'],
  },

  'powers-roots': {
    requiredConfig: true,

    requiredFields: [
      'baseRange',
      'exponentRange',
      'forms',
      'allowNegativeBase',
    ],

    ranges: ['baseRange', 'exponentRange'],

    booleanFields: ['allowNegativeBase'],

    forms: [
      'power-value',
      'multiply-same-base',
      'divide-same-base',
      'power-of-power',
      'square-root',
      'cube-root',
      'simplify-square-root',
    ],
  },

  expressions: {
    requiredConfig: true,

    requiredFields: ['coefficientRange', 'constantRange', 'forms'],

    ranges: ['coefficientRange', 'constantRange'],

    forms: [
      'expand-brackets',
      'combine-like-terms',
      'factor-common',
      'difference-of-squares',
    ],
  },

  'linear-equation': {
    requiredConfig: true,

    requiredFields: [
      'answerRange',
      'coefficientRange',
      'constantRange',
      'forms',
    ],

    ranges: ['answerRange', 'coefficientRange', 'constantRange'],

    forms: ['ax+b=c', 'ax=b', 'a(x+b)=c', 'ax+b=cx+d'],
  },

  'quadratic-equation': {
    requiredConfig: true,

    requiredFields: ['rootRange', 'forms'],

    ranges: ['rootRange'],

    forms: ['two-roots', 'double-root'],
  },

  'rational-equation': {
    requiredConfig: true,

    requiredFields: [
      'answerRange',
      'coefficientRange',
      'constantRange',
      'forms',
    ],

    ranges: ['answerRange', 'coefficientRange', 'constantRange'],

    forms: ['a-over-x-minus-b', 'linear-fraction'],
  },

  'advanced-equation': {
    requiredConfig: true,

    requiredFields: ['answerRange', 'baseRange', 'constantRange', 'forms'],

    ranges: ['answerRange', 'baseRange', 'constantRange'],

    forms: ['exponential', 'irrational', 'logarithmic-shift'],
  },

  inequality: {
    requiredConfig: true,

    requiredFields: ['rootRange', 'coefficientRange', 'constantRange', 'forms'],

    ranges: ['rootRange', 'coefficientRange', 'constantRange'],

    forms: ['linear', 'quadratic', 'system-linear'],
  },

  function: {
    requiredConfig: true,

    requiredFields: ['xRange', 'coefficientRange', 'constantRange', 'forms'],

    ranges: ['xRange', 'coefficientRange', 'constantRange'],

    forms: ['value', 'zeros', 'vertex', 'graph-value'],
  },

  percentage: {
    requiredConfig: true,

    requiredFields: ['numberRange', 'percentValues', 'forms'],

    ranges: ['numberRange'],

    arrayFields: ['percentValues'],

    forms: [
      'percent-of-number',
      'number-by-percent',
      'percentage-ratio',
      'increase-by-percent',
      'decrease-by-percent',
      'percentage-change',
      'successive-change',
    ],
  },

  'logarithm-equation': {
    requiredConfig: false,
  },

  trigonometry: {
    requiredConfig: true,

    requiredFields: ['forms'],

    forms: ['standard-value', 'basic-equation', 'identity', 'right-triangle'],
  },

  vector: {
    requiredConfig: true,

    requiredFields: ['coordinateRange', 'forms'],

    ranges: ['coordinateRange'],

    forms: ['coordinates-2d', 'coordinates-3d', 'length-2d', 'dot-product'],
  },

  combinatorics: {
    requiredConfig: true,

    requiredFields: ['nRange', 'forms'],

    ranges: ['nRange'],

    forms: ['permutation', 'combination', 'arrangement'],
  },

  probability: {
    requiredConfig: true,

    requiredFields: ['countRange', 'forms'],

    ranges: ['countRange'],

    forms: ['classical', 'complement', 'independent-events'],
  },

  statistics: {
    requiredConfig: true,

    requiredFields: ['valueRange', 'itemCountRange', 'forms'],

    ranges: ['valueRange', 'itemCountRange'],

    forms: ['mean', 'median', 'mode', 'range', 'bar-chart'],
  },

  geometry2d: {
    requiredConfig: true,

    requiredFields: ['lengthRange', 'forms'],

    ranges: ['lengthRange'],

    forms: ['rectangle-area', 'triangle-area', 'circle-area', 'pythagorean'],
  },

  'geometry2d-extended': {
    requiredConfig: true,

    requiredFields: ['lengthRange', 'coordinateRange', 'forms'],

    ranges: ['lengthRange', 'coordinateRange'],

    forms: [
      'trapezoid-area',
      'parallelogram-area',
      'rhombus-area',
      'circumference',
      'arc-length',
      'sector-area',
      'distance-between-points',
    ],
  },

  geometry3d: {
    requiredConfig: true,

    requiredFields: ['lengthRange', 'forms'],

    ranges: ['lengthRange'],

    forms: [
      'rectangular-prism-volume',
      'prism-volume',
      'pyramid-volume',
      'cylinder-volume',
      'cone-volume',
      'sphere-volume',
      'sphere-surface',
    ],
  },

  sequence: {
    requiredConfig: true,

    requiredFields: [
      'startRange',
      'differenceRange',
      'ratioRange',
      'nRange',
      'forms',
    ],

    ranges: ['startRange', 'differenceRange', 'ratioRange', 'nRange'],

    forms: [
      'arithmetic-next',
      'arithmetic-nth',
      'arithmetic-sum',
      'geometric-next',
      'geometric-nth',
      'geometric-sum',
    ],
  },

  calculus: {
    requiredConfig: true,

    requiredFields: ['coefficientRange', 'powerRange', 'xRange', 'forms'],

    ranges: ['coefficientRange', 'powerRange', 'xRange'],

    forms: [
      'limit-polynomial',
      'derivative-at-point',
      'tangent-slope',
      'indefinite-integral-monomial',
      'definite-integral-monomial',
    ],
  },

  'advanced-calculus': {
    requiredConfig: true,

    requiredFields: ['coefficientRange', 'xRange', 'powerRange', 'forms'],

    ranges: ['coefficientRange', 'xRange', 'powerRange'],

    forms: [
      'limit-factorization',
      'chain-rule',
      'product-rule',
      'quotient-rule',
      'extremum-quadratic',
      'substitution-integral',
    ],
  },

  'linear-algebra': {
    requiredConfig: true,

    requiredFields: ['valueRange', 'forms'],

    ranges: ['valueRange'],

    forms: [
      'matrix-addition',
      'matrix-multiplication',
      'determinant-2x2',
      'linear-system-2x2',
      'vector-linear-combination',
    ],
  },

  'advanced-linear-algebra': {
    requiredConfig: true,

    requiredFields: ['valueRange', 'forms'],

    ranges: ['valueRange'],

    forms: [
      'determinant-3x3',
      'inverse-2x2',
      'rank-basic',
      'eigenvalues-diagonal',
      'eigenvector-diagonal',
    ],
  },

  'complex-number': {
    requiredConfig: true,

    requiredFields: ['valueRange', 'forms'],

    ranges: ['valueRange'],

    forms: [
      'addition',
      'subtraction',
      'multiplication',
      'modulus',
      'power-of-i',
    ],
  },

  'differential-equation': {
    requiredConfig: true,

    requiredFields: [
      'coefficientRange',
      'initialValueRange',
      'xRange',
      'forms',
    ],

    ranges: ['coefficientRange', 'initialValueRange', 'xRange'],

    forms: [
      'constant-derivative',
      'linear-x-derivative',
      'exponential-general-solution',
    ],
  },

  'discrete-math': {
    requiredConfig: true,

    requiredFields: ['valueRange', 'forms'],

    ranges: ['valueRange'],

    forms: [
      'set-union',
      'set-intersection',
      'set-cardinality',
      'logic-implication',
      'graph-handshake',
    ],
  },

  series: {
    requiredConfig: true,

    requiredFields: ['valueRange', 'nRange', 'forms'],

    ranges: ['valueRange', 'nRange'],

    forms: [
      'finite-arithmetic-sum',
      'finite-geometric-sum',
      'infinite-geometric-sum',
      'convergence-geometric',
      'taylor-basic',
    ],
  },

  'number-theory': {
    requiredConfig: true,

    requiredFields: ['valueRange', 'forms'],

    ranges: ['valueRange'],

    forms: ['gcd', 'lcm', 'divisibility', 'prime-check', 'modular-remainder'],
  },

  'graph-theory': {
    requiredConfig: true,

    requiredFields: ['vertexRange', 'forms'],

    ranges: ['vertexRange'],

    forms: [
      'complete-graph-edges',
      'tree-edges',
      'degree-sum',
      'cycle-vertices',
      'path-length',
    ],
  },

  'numerical-method': {
    requiredConfig: true,

    requiredFields: ['xRange', 'forms'],

    ranges: ['xRange'],

    forms: [
      'bisection-step',
      'newton-step',
      'finite-difference',
      'trapezoid-rule',
    ],
  },
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertString(value: unknown, path: string) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${path} має бути непорожнім рядком.`);
  }
}

function assertRange(value: unknown, path: string): asserts value is Range {
  if (
    !Array.isArray(value) ||
    value.length !== 2 ||
    typeof value[0] !== 'number' ||
    typeof value[1] !== 'number' ||
    !Number.isFinite(value[0]) ||
    !Number.isFinite(value[1])
  ) {
    throw new Error(`${path} має бути числовим діапазоном [min, max].`);
  }

  if (value[0] > value[1]) {
    throw new Error(`${path}: min не може бути більшим за max.`);
  }
}

function assertNonEmptyArray(
  value: unknown,
  path: string,
): asserts value is unknown[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${path} має бути непорожнім масивом.`);
  }
}

function assertNumberArray(value: unknown, path: string) {
  assertNonEmptyArray(value, path);

  for (const item of value) {
    if (typeof item !== 'number' || !Number.isFinite(item)) {
      throw new Error(`${path} має містити лише скінченні числа.`);
    }
  }
}

function validateForms(
  value: unknown,
  allowedForms: readonly string[],
  path: string,
) {
  assertNonEmptyArray(value, path);

  const seen = new Set<string>();

  for (const form of value) {
    if (typeof form !== 'string') {
      throw new Error(`${path} містить значення, яке не є рядком.`);
    }

    if (!allowedForms.includes(form)) {
      throw new Error(`${path}: невідома форма "${form}".`);
    }

    if (seen.has(form)) {
      throw new Error(`${path}: форма "${form}" повторюється.`);
    }

    seen.add(form);
  }
}
function validateUnknownConfigFields(
  config: Record<string, unknown>,
  rules: GeneratorRules,
  path: string,
) {
  const allowedFields = new Set<string>([
    ...(rules.requiredFields ?? []),
    ...(rules.ranges ?? []),
    ...(rules.arrayFields ?? []),
    ...(rules.booleanFields ?? []),
  ]);

  if (rules.forms) {
    allowedFields.add('forms');
  }

  for (const field of Object.keys(config)) {
    if (!allowedFields.has(field)) {
      throw new Error(`${path}.config: невідоме поле "${field}".`);
    }
  }
}

function validateConfig(definition: GeneratorDefinition, path: string) {
  const rules = generatorRules[definition.id];

  if (!rules) {
    throw new Error(
      `${path}: немає правил валідації для генератора "${definition.id}".`,
    );
  }

  if (rules.requiredConfig && !definition.config) {
    throw new Error(`${path}: відсутній config.`);
  }

  if (!definition.config) {
    return;
  }

  if (!isObject(definition.config)) {
    throw new Error(`${path}.config має бути об'єктом.`);
  }

  const config = definition.config;
  validateUnknownConfigFields(config, rules, path);

  for (const field of rules.requiredFields ?? []) {
    if (!(field in config)) {
      throw new Error(`${path}.config.${field} є обов'язковим.`);
    }
  }

  for (const rangeField of rules.ranges ?? []) {
    assertRange(config[rangeField], `${path}.config.${rangeField}`);
  }

  for (const arrayField of rules.arrayFields ?? []) {
    assertNumberArray(config[arrayField], `${path}.config.${arrayField}`);
  }
  for (const booleanField of rules.booleanFields ?? []) {
    if (typeof config[booleanField] !== 'boolean') {
      throw new Error(`${path}.config.${booleanField} має бути boolean.`);
    }
  }

  if (rules.forms) {
    validateForms(config.forms, rules.forms, `${path}.config.forms`);
  }
}

function validateGenerator(definition: GeneratorDefinition, path: string) {
  if (!isObject(definition)) {
    throw new Error(`${path} має бути об'єктом.`);
  }

  assertString(definition.id, `${path}.id`);

  if (!isGeneratorId(definition.id)) {
    throw new Error(`${path}: генератор "${definition.id}" не зареєстрований.`);
  }

  validateConfig(definition, path);
}

function validateTopic(topic: TopicDefinition, index: number) {
  const path = `course.topics[${index}]`;

  if (!isObject(topic)) {
    throw new Error(`${path} має бути об'єктом.`);
  }
  assertNoUnknownFields(topic, ['id', 'name', 'generators'], path);
  assertString(topic.id, `${path}.id`);

  assertString(topic.name, `${path}.name`);

  assertNonEmptyArray(topic.generators, `${path}.generators`);

  const generatorIds = new Set<string>();

  topic.generators.forEach((generator, generatorIndex) => {
    validateGenerator(generator, `${path}.generators[${generatorIndex}]`);

    if (generatorIds.has(generator.id)) {
      throw new Error(`${path}: генератор "${generator.id}" повторюється.`);
    }

    generatorIds.add(generator.id);
  });
}

export function validateCourse(value: unknown): Course {
  if (!isObject(value)) {
    throw new Error('Course має бути об’єктом.');
  }
  assertNoUnknownFields(
    value,
    ['id', 'name', 'description', 'topics'],
    'course',
  );
  assertString(value.id, 'course.id');

  assertString(value.name, 'course.name');

  if (
    value.description !== undefined &&
    typeof value.description !== 'string'
  ) {
    throw new Error('course.description має бути рядком.');
  }

  assertNonEmptyArray(value.topics, 'course.topics');

  const topicIds = new Set<string>();

  value.topics.forEach((topic, index) => {
    validateTopic(topic as TopicDefinition, index);

    const typedTopic = topic as TopicDefinition;

    if (topicIds.has(typedTopic.id)) {
      throw new Error(
        `course.topics: topic id "${typedTopic.id}" повторюється.`,
      );
    }

    topicIds.add(typedTopic.id);
  });

  return value as unknown as Course;
}
