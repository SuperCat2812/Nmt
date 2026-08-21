import type {
  LinearEquationConfig,
  LinearEquationForm,
} from '@/types/generator';
import type { Question, SolutionStep } from '@/types/question';
import { createNumericOptions } from '@/utils/createNumericOptions';
import { formatCoefficient } from '@/utils/formatMath';
import { randomFromRange, randomItem } from '@/utils/random';

function randomNonZeroFromRange(range: readonly [number, number]): number {
  let value = 0;
  while (value === 0) {
    value = randomFromRange(range);
  }
  return value;
}
function formatConstantTerm(value: number): string {
  if (value === 0) return '';
  return value > 0 ? ` + ${value}` : ` - ${Math.abs(value)}`;
}
function formatLinearTerm(coefficient: number): string {
  return `${formatCoefficient(coefficient)}x`;
}
function createOptions(answer: number) {
  return createNumericOptions(answer, [
    answer + 1,
    answer - 1,
    -answer,
    answer + 2,
    answer - 2,
    answer + 3,
    answer - 3,
  ]);
}

function generateAxPlusBEqualsC(
  config: LinearEquationConfig,
  x: number,
): Question {
  const a = randomNonZeroFromRange(config.coefficientRange);
  const b = randomFromRange(config.constantRange);
  const c = a * x + b;
  const ax = formatLinearTerm(a);
  const equation = `${ax}${formatConstantTerm(b)} = ${c}`;
  const axValue = c - b;
  const solution: SolutionStep[] = [{ math: equation }];
  if (b > 0) {
    solution.push(
      {
        math: `${ax} = ${c} - ${b}`,
      },
      { math: `${ax} = ${axValue}` },
    );
  } else if (b < 0) {
    solution.push(
      {
        math: `${ax} = ${c} + ${Math.abs(b)}`,
      },
      {
        math: `${ax} = ${axValue}`,
      },
    );
  }
  if (a !== 1 && a !== -1) {
    solution.push(
      { math: `x = \\frac{${axValue}}{${a}}` },
      { math: `x = ${x}` },
    );
  } else if (a === -1 || b !== 0) solution.push({ math: `x = ${x}` });

  return {
    id: crypto.randomUUID(),
    generatorId: 'linear-equation',
    familyId: 'equations',
    variantKey: `linear:ax+b=c:${a}:${b}:${c}`,
    topicId: 'equations',
    type: 'single-choice',
    title: 'Лінійне рівняння',
    math: equation,
    options: createOptions(x),
    correctAnswer: String(x),
    solution,
  };
}

function generateAxEqualsB(config: LinearEquationConfig, x: number): Question {
  const a = randomNonZeroFromRange(config.coefficientRange);
  const b = a * x;
  const ax = formatLinearTerm(a);
  const equation = `${ax} = ${b}`;
  const solution: SolutionStep[] = [{ math: equation }];
  if (a !== 1 && a !== -1) {
    solution.push({ math: `x = \\frac{${b}}{${a}}` }, { math: `x = ${x}` });
  } else if (a === -1) solution.push({ math: `x = ${x}` });

  return {
    id: crypto.randomUUID(),
    generatorId: 'linear-equation',
    familyId: 'equations',
    variantKey: `linear:ax=b:${a}:${b}`,
    topicId: 'equations',
    type: 'single-choice',
    title: 'Лінійне рівняння',
    math: equation,
    options: createOptions(x),
    correctAnswer: String(x),
    solution,
  };
}

function generateBrackets(config: LinearEquationConfig, x: number): Question {
  const a = randomNonZeroFromRange(config.coefficientRange);
  const b = randomFromRange(config.constantRange);
  const insideValue = x + b;
  const c = a * insideValue;
  const aText = formatCoefficient(a);
  const inside = `x${formatConstantTerm(b)}`;
  const equation = `${aText}(${inside}) = ${c}`;
  const solution: SolutionStep[] = [{ math: equation }];
  if (a !== 1 && a !== -1) {
    solution.push(
      { math: `${inside} = \\frac{${c}}{${a}}` },
      { math: `${inside} = ${insideValue}` },
    );
  } else if (a === -1) solution.push({ math: `${inside} = ${-c}` });
  if (b > 0) {
    solution.push({ math: `x = ${insideValue} - ${b}` });
  } else if (b < 0)
    solution.push({ math: `x = ${insideValue} + ${Math.abs(b)}` });
  if (a !== 1 || b !== 0) solution.push({ math: `x = ${x}` });
  return {
    id: crypto.randomUUID(),
    generatorId: 'linear-equation',
    familyId: 'equations',
    variantKey: `linear:a(x+b)=c:${a}:${b}:${c}`,
    topicId: 'equations',
    type: 'single-choice',
    title: 'Лінійне рівняння',
    math: equation,
    options: createOptions(x),
    correctAnswer: String(x),
    solution,
  };
}

function generateBothSides(config: LinearEquationConfig, x: number): Question {
  const a = randomNonZeroFromRange(config.coefficientRange);
  let c = randomFromRange(config.coefficientRange);
  while (c === a) {
    c = randomFromRange(config.coefficientRange);
  }
  const b = randomFromRange(config.constantRange);
  const d = (a - c) * x + b;
  const left = `${formatLinearTerm(a)}${formatConstantTerm(b)}`;
  const right = `${formatLinearTerm(c)}${formatConstantTerm(d)}`;
  const equation = `${left} = ${right}`;
  const reducedCoefficient = a - c;
  const reducedConstant = d - b;
  const reducedTerm = formatLinearTerm(reducedCoefficient);
  const solution: SolutionStep[] = [
    { math: equation },
    { text: 'Перенесемо доданки з x в одну частину, а числа — в іншу.' },
    {
      math: `${reducedTerm} = ${d} - (${b})`,
    },
    { math: `${reducedTerm} = ${reducedConstant}` },
  ];
  if (reducedCoefficient !== 1 && reducedCoefficient !== -1)
    solution.push({
      math: `x = \\frac{${reducedConstant}}{${reducedCoefficient}}`,
    });
  solution.push({
    math: `x = ${x}`,
  });
  return {
    id: crypto.randomUUID(),
    generatorId: 'linear-equation',
    familyId: 'equations',
    variantKey: `linear:both-sides:${a}:${b}:${c}:${d}`,
    topicId: 'equations',
    type: 'single-choice',
    title: 'Лінійне рівняння',
    math: equation,
    options: createOptions(x),
    correctAnswer: String(x),
    solution,
  };
}

const generatorsByForm: Record<
  LinearEquationForm,
  (config: LinearEquationConfig, x: number) => Question
> = {
  'ax+b=c': generateAxPlusBEqualsC,
  'ax=b': generateAxEqualsB,
  'a(x+b)=c': generateBrackets,
  'ax+b=cx+d': generateBothSides,
};

export function generateLinearEquation(config: LinearEquationConfig): Question {
  if (config.forms.length === 0)
    throw new Error('Для лінійних рівнянь не задано жодної форми.');
  const x = randomFromRange(config.answerRange);
  const form = randomItem([...config.forms]);
  return generatorsByForm[form](config, x);
}
