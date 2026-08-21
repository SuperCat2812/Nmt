# NMT Math Trainer

Interactive mathematics training application for preparation for the Ukrainian National Multi-Subject Test (NMT).

The application dynamically generates mathematics problems, checks answers, provides step-by-step solutions, tracks progress, and stores training history locally in the browser.

[English](#english) | [Українська](#українська)

---

# English

## About the Project

**NMT Math Trainer** is an interactive mathematics practice platform designed to help students prepare for the Ukrainian National Multi-Subject Test (NMT).

Instead of relying only on a fixed collection of questions, the application uses mathematical generators that dynamically create new exercises.

This makes it possible to generate many variations of the same mathematical concept while keeping the underlying mathematical rules consistent.

Users can practice one topic at a time or combine several topics into a mixed training session.

The project also includes automated mathematical validation, unit and integration tests, browser E2E tests, mobile tests, and stress scenarios.

---

## Live Demo

[NMT Math Trainer](https://nmt-two.vercel.app/)

---

## Repository

[GitHub Repository](https://github.com/SuperCat2812/Nmt/)

---

## Features

- Single-topic training
- Mixed-topic training
- Dynamic mathematical problem generation
- Configurable number of questions
- Single-choice questions
- Numeric-answer questions
- Matching questions
- Automatic answer validation
- Step-by-step solutions
- Mathematical formulas rendered with KaTeX
- Function and geometry visualizations
- Training results
- Training statistics
- Topic progress tracking
- Training history
- Browser persistence with `localStorage`
- Responsive interface
- Desktop support
- Mobile support
- Automated mathematical validation
- Unit and integration testing with Vitest
- End-to-end testing with Playwright
- Desktop and mobile E2E projects
- Generator stress testing
- User-flow stress testing
- Production build validation

---

# Supported Mathematics

## NMT Mathematics

The NMT course contains generators for the main school mathematics topics.

### Fractions

- Fraction operations
- Comparison
- Simplification
- Addition
- Subtraction
- Multiplication
- Division

### Percentages

- Percentage of a number
- Finding a number from its percentage
- Percentage increase
- Percentage decrease
- Percentage change
- Ratios

### Powers and Roots

- Powers
- Roots
- Exponent rules
- Simplification

### Algebraic Expressions

- Algebraic transformations
- Identities
- Difference of squares
- Expression simplification

### Equations

- Linear equations
- Quadratic equations
- Rational equations
- Advanced equations

### Inequalities

- Algebraic inequalities
- Interval reasoning
- Inequality transformations

### Functions

- Function values
- Function properties
- Function graphs
- Analytical interpretation

### Logarithms

- Logarithmic expressions
- Logarithmic equations
- Logarithm properties

### Sequences and Progressions

- Arithmetic progressions
- Geometric progressions
- Sequence terms
- Progression formulas

### Trigonometry

- Trigonometric values
- Identities
- Equations
- Basic trigonometric relationships

### Plane Geometry

- Triangles
- Quadrilaterals
- Circles
- Areas
- Perimeters
- Extended geometry problems

### Solid Geometry

- Three-dimensional figures
- Volumes
- Surface calculations
- Spheres
- Other solids

### Vectors

- Vector operations
- Coordinates
- Scalar products
- Vector relationships

### Combinatorics

- Counting problems
- Permutations
- Combinations
- Combinatorial calculations

### Probability

- Basic probability
- Events
- Probability calculations

### Statistics

- Statistical values
- Data analysis
- Descriptive statistics

---

# Advanced Mathematics

The project also contains generators for advanced mathematical topics.

These generators demonstrate that the architecture is not limited only to NMT mathematics.

Supported advanced areas include:

- Calculus
- Advanced Calculus
- Linear Algebra
- Advanced Linear Algebra
- Complex Numbers
- Series
- Differential Equations
- Discrete Mathematics
- Number Theory
- Graph Theory
- Numerical Methods

---

# Training Modes

## Single Topic

The user selects one mathematical topic.

The trainer generates questions specifically for that topic.

Typical flow:

1. Select single-topic mode.
2. Select a topic.
3. Choose the number of questions.
4. Start training.
5. Answer the questions.
6. View the final result.

---

## Mixed Mode

Several topics can be selected simultaneously.

The trainer creates one training session containing questions from the selected categories.

This makes it possible to practice several areas of mathematics in one session.

---

# Training Flow

The general user flow is:

1. Open the trainer.
2. Select a training mode.
3. Select one or multiple topics.
4. Choose the number of questions.
5. Start the training session.
6. Read the generated question.
7. Select or enter an answer.
8. Check the answer.
9. View whether the answer is correct.
10. Read the step-by-step solution.
11. Continue to the next question.
12. Complete the training session.
13. Review the result.
14. Review topic progress.
15. Review training history.

---

# Question Types

The trainer supports several question formats.

## Single Choice

The user selects one answer from generated answer options.

## Numeric Answer

The user manually enters a numerical result.

## Matching

The user establishes correspondence between elements from two sets.

---

# Question Generation

Questions are generated dynamically by dedicated mathematical generators.

A generated question can contain:

- Unique question ID
- Generator ID
- Family ID
- Variant key
- Topic ID
- Question type
- Title
- Text
- Mathematical expression
- Answer options
- Correct answer
- Solution steps
- Visualization data

Example:

```ts
{
  id: '...',
  generatorId: 'linear-equation',
  familyId: 'linear',
  variantKey: 'linear:2:3:7',
  topicId: 'equations',
  type: 'single-choice',
  title: 'Розв’яжіть рівняння',
  math: '2x + 3 = 7',
  options: [
    // generated options
  ],
  correctAnswer: '2',
  solution: [
    // solution steps
  ]
}
```

Randomized generators are stress-tested with large numbers of generated questions.

This helps detect rare invalid mathematical combinations.

---

# Answer Validation

The answer-checking engine validates user answers according to the question type.

It supports:

```text
single-choice
numeric
matching
```

The application checks the answer before displaying the result and solution.

---

# Step-by-Step Solutions

After checking an answer, the trainer displays:

- Whether the answer is correct
- Correct answer when appropriate
- Separate solution section
- Mathematical solution steps

Mathematical expressions are rendered using KaTeX.

---

# Visualizations

Some questions contain generated visual information.

The project can display:

- Function graphs
- Geometry
- Charts
- Mathematical diagrams
- Other generated visual representations

Visualization technologies include:

- JSXGraph
- Recharts

---

# Progress and History

The application tracks training activity locally.

It can store:

- Completed training sessions
- Results
- Topic progress
- Training history

User data is persisted through browser:

```text
localStorage
```

Therefore, the current application does not require a backend or database for basic operation.

---

# Tech Stack

## Core

- Next.js 16
- React 19
- TypeScript

## Mathematics

- KaTeX
- React KaTeX
- MathJS
- JSXGraph

## Visualization

- Recharts

## Styling

- CSS Modules
- Global CSS

## Testing

- Vitest
- Playwright

## Development

- ESLint
- npm
- Git

## Deployment

- Vercel

---

# Project Structure

```text
nmt-math-trainer/
├── app/
│   ├── globals.css
│   └── ...
│
├── components/
│   ├── QuestionCard/
│   ├── Trainer/
│   ├── MathFormula/
│   ├── VisualRenderer/
│   └── ...
│
├── data/
│   ├── course.json
│   ├── university-math.json
│   └── activeCourse.ts
│
├── engine/
│   ├── answerChecker.ts
│   ├── generatorRegistry.ts
│   └── ...
│
├── generators/
│   ├── fractions/
│   ├── percentages/
│   ├── powersRoots/
│   ├── expressions/
│   ├── equations/
│   ├── inequalities/
│   ├── functions/
│   ├── logarithms/
│   ├── sequences/
│   ├── trigonometry/
│   ├── geometry/
│   ├── vectors/
│   ├── probability/
│   ├── calculus/
│   └── ...
│
├── types/
│   ├── question.ts
│   ├── generator.ts
│   └── ...
│
├── utils/
│   └── ...
│
├── test/
│   ├── formulaSanity.test.ts
│   ├── generatorStress.test.ts
│   └── ...
│
├── e2e/
│   ├── helpers.ts
│   ├── allTopics.spec.ts
│   ├── userStress.spec.ts
│   └── ...
│
├── playwright.config.ts
├── vitest.config.mts
├── package.json
└── README.md
```

---

# Course Database Architecture

One of the main ideas of the project is separating:

```text
UI
↓
Course configuration
↓
Generator registry
↓
Mathematical generators
↓
Generated Question
```

The user interface does not need to know how every mathematical problem is generated.

Instead, the active course defines which topics and generators are available.

This makes the trainer reusable for different mathematics courses.

---

# How to Change the Course Database

The trainer is designed so that the visible course can be changed without rewriting the entire interface.

Course definitions are stored in JSON files inside:

```text
data/
├── course.json
├── university-math.json
└── activeCourse.ts
```

The project contains different course configurations, for example:

```text
nmt-math-2026
university-math
```

---

## Course JSON Structure

A course contains:

```text
Course
│
├── id
├── name
├── description
│
└── topics
    │
    ├── Topic
    │   ├── id
    │   ├── name
    │   │
    │   └── generators
    │       │
    │       ├── id
    │       └── config
    │
    └── ...
```

Example:

```json
{
  "id": "my-course",
  "name": "My Mathematics Course",
  "description": "Custom mathematics course",
  "topics": [
    {
      "id": "equations",
      "name": "Equations",
      "generators": [
        {
          "id": "linear-equation",
          "config": {
            "answerRange": [-10, 10],
            "coefficientRange": [-9, 9],
            "constantRange": [-15, 15],
            "forms": [
              "ax+b=c",
              "ax=b"
            ]
          }
        }
      ]
    }
  ]
}
```

---

# What Can Be Changed Through JSON

Depending on the generator, configuration can control:

- Course name
- Course description
- Topic names
- Topic order
- Available generators
- Generator configuration
- Mathematical forms
- Numeric ranges
- Coefficient ranges
- Coordinate ranges
- Allowed negative values
- Other generator-specific settings

For example:

```json
{
  "id": "fraction",
  "config": {
    "numeratorRange": [1, 12],
    "denominatorRange": [2, 12],
    "forms": [
      "reduce",
      "compare",
      "add",
      "subtract",
      "multiply",
      "divide"
    ],
    "allowNegative": false,
    "allowImproper": false
  }
}
```

Changing:

```json
"numeratorRange": [1, 12]
```

to:

```json
"numeratorRange": [1, 50]
```

allows the generator to use a larger numerator range.

Changing:

```json
"allowNegative": false
```

to:

```json
"allowNegative": true
```

allows negative values if the generator supports them.

Removing a form from:

```json
"forms": [
  "reduce",
  "compare",
  "add"
]
```

means that form will no longer be selected.

---

# Important: JSON Does Not Create Generator Logic

The JSON configuration describes which existing generators should be used and how they should be configured.

It does not automatically create mathematical algorithms.

For example:

```json
{
  "id": "linear-equation"
}
```

works only if:

```text
linear-equation
```

already exists in the generator registry.

An unknown generator:

```json
{
  "id": "my-new-generator"
}
```

will not work until the generator is implemented and registered.

Therefore:

```text
Changing existing course
        ↓
Usually JSON only

Adding new mathematical algorithm
        ↓
Generator code + registry + config + tests
```

---

# Adding a New Course

Create a new JSON file.

For example:

```text
data/my-course.json
```

Example:

```json
{
  "id": "my-course",
  "name": "My Custom Mathematics Course",
  "description": "Custom training configuration",
  "topics": [
    {
      "id": "basic-equations",
      "name": "Basic Equations",
      "generators": [
        {
          "id": "linear-equation",
          "config": {
            "answerRange": [-5, 5],
            "coefficientRange": [1, 5],
            "constantRange": [-10, 10],
            "forms": [
              "ax+b=c",
              "ax=b"
            ]
          }
        }
      ]
    }
  ]
}
```

---

# Registering a New Course

After creating the JSON file, import it in:

```text
data/activeCourse.ts
```

For example:

```ts
import nmtCourse from './course.json';
import universityCourse from './university-math.json';
import myCourse from './my-course.json';

export const courses = {
  'nmt-math-2026': nmtCourse,
  'university-math': universityCourse,
  'my-course': myCourse,
} as const;
```

Now the application knows about the new course.

---

# Selecting the Active Course

The active course can be selected using:

```text
NEXT_PUBLIC_COURSE_ID
```

For example:

```env
NEXT_PUBLIC_COURSE_ID=nmt-math-2026
```

or:

```env
NEXT_PUBLIC_COURSE_ID=university-math
```

or:

```env
NEXT_PUBLIC_COURSE_ID=my-course
```

---

## Local Development

Create:

```text
.env.local
```

Example:

```env
NEXT_PUBLIC_COURSE_ID=university-math
```

Restart the development server:

```bash
npm run dev
```

Environment variables are loaded when the application starts/builds, so the development server should be restarted after changing them.

---

## Changing Course on Vercel

Open the Vercel project.

Go to:

```text
Settings
↓
Environment Variables
```

Add or change:

```text
NEXT_PUBLIC_COURSE_ID
```

For example:

```text
university-math
```

Then redeploy the application.

Because this variable starts with:

```text
NEXT_PUBLIC_
```

it is available to the client-side Next.js application and its value is included in the corresponding build.

---

# Adding a New Generator

If an existing generator already supports the required type of question, usually only the JSON configuration needs to be changed.

A completely new mathematical algorithm requires a new generator.

Typical process:

```text
1. Create generator
        ↓
2. Create/update config type
        ↓
3. Register generator
        ↓
4. Add configuration validation
        ↓
5. Add generator to course JSON
        ↓
6. Add mathematical tests
        ↓
7. Add stress tests
        ↓
8. Run full project validation
```

---

## 1. Create Generator

Example:

```text
generators/myTopic/myGenerator.ts
```

The generator must produce a valid:

```ts
Question
```

---

## 2. Add Generator Configuration Type

Generator configuration types are defined in the project's TypeScript types.

Example:

```ts
export interface MyGeneratorConfig {
  valueRange: [number, number];
  forms: MyGeneratorForm[];
}
```

---

## 3. Register Generator

Open:

```text
engine/generatorRegistry.ts
```

Import the generator:

```ts
import { generateMyQuestion } from '@/generators/myTopic/myGenerator';
```

Then connect the generator ID to its implementation.

Conceptually:

```ts
'my-generator': (config) => generateMyQuestion(config)
```

The exact implementation should follow the existing registry types and validation architecture.

---

## 4. Add Configuration Validation

The application should reject invalid generator configuration.

Validation should check things such as:

- Required ranges exist
- Ranges contain valid values
- `min <= max`
- Required forms exist
- Forms are supported
- Required generator options are present

---

## 5. Add Generator to Course JSON

Example:

```json
{
  "id": "my-topic",
  "name": "My Topic",
  "generators": [
    {
      "id": "my-generator",
      "config": {
        "valueRange": [1, 10],
        "forms": [
          "form-a",
          "form-b"
        ]
      }
    }
  ]
}
```

---

## 6. Test the Generator

At minimum, verify:

- Generator does not crash
- Question contains a valid ID
- `variantKey` is valid
- Correct answer exists
- Correct answer is mathematically correct
- Answer options are valid
- No empty answer options exist
- Generated formulas are valid
- Solution corresponds to the problem
- Random generation remains stable

---

# Course Data vs User Data

The project contains two fundamentally different types of data.

## Course Data

Stored in files such as:

```text
data/course.json
data/university-math.json
```

Course data controls:

- Topics
- Generators
- Generator configuration
- Mathematical ranges
- Mathematical forms
- Course structure

---

## User Data

Stored in:

```text
localStorage
```

User data contains information such as:

- Training history
- Results
- Topic progress

These systems are independent.

Changing:

```text
course.json
```

does not automatically remove user history.

During development, after major changes to the course structure, it may be useful to clear browser storage.

---

# Installation

Clone the repository:

```bash
git clone https://github.com/SuperCat2812/Nmt.git
```

Open the project directory:

```bash
cd nmt-math-trainer
```

Install dependencies:

```bash
npm install
```

Start development:

```bash
npm run dev
```

---

# Available Commands

## Development

```bash
npm run dev
```

---

## ESLint

```bash
npm run lint
```

---

## TypeScript

```bash
npm run typecheck
```

Equivalent:

```bash
npx tsc --noEmit
```

---

## Vitest

Run unit/integration tests:

```bash
npm run test
```

or:

```bash
npm run test:unit
```

Watch mode:

```bash
npm run test:watch
```

---

## Playwright

Run all E2E tests:

```bash
npm run test:e2e
```

Open Playwright UI:

```bash
npm run test:e2e:ui
```

Important:

```bash
npm run test:e2e:ui
```

not:

```bash
npm test:e2e:ui
```

Run with visible browser:

```bash
npm run test:e2e:headed
```

Run Chromium:

```bash
npm run test:e2e:chromium
```

Run mobile:

```bash
npm run test:e2e:mobile
```

---

## Production Build

```bash
npm run build
```

Start production server:

```bash
npm run start
```

---

# Complete Pre-Deployment Check

Run:

```bash
npm run test:full
```

The command runs:

```text
ESLint
   ↓
TypeScript
   ↓
Vitest
   ↓
Playwright
   ↓
Next.js production build
```

This provides one complete validation pipeline before deployment.

---

# Testing Strategy

The project uses several levels of automated validation.

---

## 1. TypeScript

TypeScript checks the application's static type safety.

```bash
npm run typecheck
```

---

## 2. ESLint

ESLint checks source-code quality and common programming problems.

```bash
npm run lint
```

---

## 3. Vitest

Vitest checks internal application and mathematical logic.

Tests can cover:

- Mathematical correctness
- Generator output
- Fractions
- Percentages
- Powers and roots
- Expressions
- Equations
- Inequalities
- Functions
- Logarithms
- Sequences
- Trigonometry
- Geometry
- Vectors
- Combinatorics
- Probability
- Statistics
- Advanced mathematics
- Answer validation
- Training sessions
- Storage
- Progress
- Answer options
- Formula sanity
- Generator stress scenarios

---

# Formula Sanity Testing

Because questions are dynamically generated, formulas require automated validation.

Formula sanity tests can detect suspicious output such as:

```text
+-
x--
NaN
Infinity
undefined
```

They also detect unexpectedly long floating-point values such as:

```text
0.3333333333333333
```

when such representation should not be displayed to the user.

Formula tests help ensure generated mathematical notation remains readable and valid.

---

# Generator Stress Testing

Generator stress tests repeatedly create randomized questions.

For example, a generator can be executed thousands of times.

This is important because a generator may work correctly for most values but fail for one rare combination.

Stress tests can detect:

- Crashes
- Empty options
- Invalid correct answers
- Invalid formulas
- Duplicate options
- Unsupported states
- Invalid random ranges
- Rare mathematical edge cases

---

# Playwright E2E Testing

Playwright tests the application from the perspective of a real user.

The E2E suite checks scenarios such as:

- Opening the trainer
- Selecting training mode
- Selecting topics
- Selecting question count
- Starting training
- Answering questions
- Checking answers
- Viewing feedback
- Viewing solutions
- Going to the next question
- Finishing training
- Viewing results
- Reload behavior
- History persistence
- Duplicate-history prevention
- Horizontal overflow
- Desktop behavior
- Mobile behavior

---

# All Topics E2E Test

The NMT topics are also tested individually through a complete user flow.

For each topic the browser can verify:

```text
Select topic
    ↓
Start training
    ↓
Question appears
    ↓
Answer question
    ↓
Feedback appears
    ↓
Solution appears
    ↓
Continue
    ↓
Result appears
```

This provides browser-level verification that every available NMT topic can participate in a real training session.

---

# User Stress Testing

The project contains user-oriented stress scenarios.

Examples include:

- Several questions from every NMT topic
- 50 questions without UI freezing
- Starting a 100-question training session
- Double-clicking the Check button
- Preventing answer changes after checking
- Reload during configuration
- History persistence
- Preventing duplicate history after reload
- Horizontal overflow checks after multiple questions

These tests go beyond the standard happy-path scenario.

---

# Desktop and Mobile E2E

Playwright contains separate projects for desktop and mobile testing.

Desktop:

```bash
npm run test:e2e:chromium
```

Mobile:

```bash
npm run test:e2e:mobile
```

This helps verify that the main user flows remain usable at different viewport sizes.

---

# Testing Before Deployment

Recommended final check:

```bash
npm run test:full
```

If necessary, TypeScript build information can also be cleared on Windows:

```powershell
Remove-Item tsconfig.tsbuildinfo -ErrorAction SilentlyContinue
npm run typecheck
```

The final validation therefore checks:

```text
Source code
     ↓
Types
     ↓
Mathematics
     ↓
Generators
     ↓
Application logic
     ↓
Browser interaction
     ↓
Responsive behavior
     ↓
Production build
```

---

# Data Storage

The current application stores progress locally through:

```text
localStorage
```

Advantages:

- No backend required
- Simple deployment
- Fast local persistence
- History survives page reloads

Limitation:

- Data belongs to the current browser/device
- Data is not automatically synchronized between devices

---

# Possible Backend Expansion

A backend and database can be added in the future for:

- User accounts
- Authentication
- Cloud training history
- Cross-device synchronization
- Global statistics
- Leaderboards
- Shared progress
- Teacher/student functionality

The mathematical generator architecture can remain independent from the persistence layer.

---

# Future Improvements

Possible future improvements:

- Authentication
- Backend
- Database
- Cloud synchronization
- Additional NMT question types
- Additional generators
- Difficulty levels
- Timed exam mode
- Full NMT simulation
- Advanced analytics
- More visualizations
- Accessibility improvements
- Further mobile optimization

---

# Українська

## Про проєкт

**NMT Math Trainer** — інтерактивний математичний тренажер для підготовки до українського Національного мультипредметного тесту (НМТ).

Замість використання лише фіксованого набору запитань застосунок використовує математичні генератори, які динамічно створюють нові завдання.

Це дозволяє отримувати багато різних варіантів задач, зберігаючи правильну математичну логіку.

Користувач може тренувати одну тему або об'єднати декілька тем у змішане тренування.

Проєкт також містить автоматичну перевірку математичної логіки, unit/integration-тести, E2E-тести браузера, mobile-тести та stress-сценарії.

---

## Demo

[NMT Math Trainer](https://nmt-two.vercel.app/)

---

## Repository

[GitHub Repository](https://github.com/SuperCat2812/Nmt/)

---

# Можливості

- Тренування однієї теми
- Змішаний режим
- Динамічна генерація математичних завдань
- Налаштування кількості завдань
- Завдання з вибором відповіді
- Завдання з числовою відповіддю
- Завдання на встановлення відповідності
- Автоматична перевірка відповідей
- Покрокові розв'язання
- Формули через KaTeX
- Візуалізація функцій і геометрії
- Результати тренування
- Статистика
- Прогрес за темами
- Історія тренувань
- Збереження через `localStorage`
- Адаптивний інтерфейс
- Desktop
- Mobile
- Vitest
- Playwright
- Stress-тести генераторів
- Stress-тести користувацьких сценаріїв
- Перевірка production build

---

# Теми НМТ

Тренажер містить генератори для:

- Звичайних дробів
- Відсотків
- Степенів та коренів
- Алгебраїчних виразів
- Рівнянь
- Нерівностей
- Функцій
- Логарифмів
- Послідовностей та прогресій
- Тригонометрії
- Планіметрії
- Стереометрії
- Векторів
- Комбінаторики
- Ймовірності
- Статистики

---

# Розширена математика

У проєкті також є генератори складніших математичних тем:

- Calculus
- Advanced Calculus
- Linear Algebra
- Advanced Linear Algebra
- Complex Numbers
- Series
- Differential Equations
- Discrete Mathematics
- Number Theory
- Graph Theory
- Numerical Methods

Це показує, що архітектура тренажера не обмежується лише НМТ.

---

# Режими тренування

## Одна тема

Користувач:

1. Обирає режим.
2. Обирає тему.
3. Вказує кількість завдань.
4. Запускає тренування.
5. Виконує завдання.
6. Переглядає результат.

---

## Змішаний режим

Можна обрати декілька тем одночасно.

Тренажер створює одну тренувальну сесію із завдань вибраних категорій.

---

# Типи завдань

Підтримуються:

```text
single-choice
numeric
matching
```

Тобто:

- вибір одного варіанта
- введення числової відповіді
- встановлення відповідності

---

# Генерація завдань

Кожне завдання генерується спеціалізованим математичним генератором.

Завдання може містити:

- `id`
- `generatorId`
- `familyId`
- `variantKey`
- `topicId`
- `type`
- `title`
- `text`
- `math`
- `options`
- `correctAnswer`
- `solution`
- `visual`

Генератори можуть створювати велику кількість різних варіантів однієї математичної задачі.

---

# Перевірка відповідей

Окремий механізм перевірки визначає правильність відповіді залежно від типу завдання.

Після перевірки користувач бачить:

- правильна відповідь чи ні
- правильну відповідь, коли потрібно
- покрокове розв'язання

---

# Візуалізація

Для математичного контенту використовуються:

- KaTeX
- JSXGraph
- Recharts

Це дозволяє відображати:

- формули
- функції
- графіки
- геометричні елементи
- інші математичні візуалізації

---

# Архітектура бази курсу

Одна з основних ідей проєкту — відокремити інтерфейс від конкретного набору математичних тем.

Схематично:

```text
Інтерфейс
    ↓
JSON курсу
    ↓
Generator Registry
    ↓
Математичний генератор
    ↓
Question
    ↓
QuestionCard
```

Завдяки цьому для зміни курсу не потрібно переписувати весь інтерфейс.

---

# Як змінити базу курсу

Конфігурації курсів знаходяться в:

```text
data/
├── course.json
├── university-math.json
└── activeCourse.ts
```

У проєкті можуть використовуватися різні курси, наприклад:

```text
nmt-math-2026
university-math
```

---

# Структура JSON бази

Приклад:

```json
{
  "id": "my-course",
  "name": "Мій курс математики",
  "description": "Опис курсу",
  "topics": [
    {
      "id": "equations",
      "name": "Рівняння",
      "generators": [
        {
          "id": "linear-equation",
          "config": {
            "answerRange": [-10, 10],
            "coefficientRange": [-9, 9],
            "constantRange": [-15, 15],
            "forms": [
              "ax+b=c",
              "ax=b"
            ]
          }
        }
      ]
    }
  ]
}
```

Структура:

```text
Курс
│
├── id
├── name
├── description
│
└── topics
    │
    ├── Тема
    │   ├── id
    │   ├── name
    │   │
    │   └── generators
    │       ├── id
    │       └── config
    │
    └── ...
```

---

# Що можна змінювати в JSON

Залежно від генератора можна змінювати:

- Назву курсу
- Опис
- Назви тем
- Порядок тем
- Генератори
- Діапазони чисел
- Діапазони коефіцієнтів
- Координати
- Дозволені форми задач
- Дозвіл від'ємних значень
- Інші параметри генератора

Наприклад:

```json
{
  "id": "fraction",
  "config": {
    "numeratorRange": [1, 12],
    "denominatorRange": [2, 12],
    "forms": [
      "reduce",
      "compare",
      "add",
      "subtract",
      "multiply",
      "divide"
    ],
    "allowNegative": false,
    "allowImproper": false
  }
}
```

Якщо змінити:

```json
"numeratorRange": [1, 12]
```

на:

```json
"numeratorRange": [1, 50]
```

генератор зможе використовувати більший діапазон чисельників.

---

# Важливо: JSON та генератор — не одне й те саме

JSON не створює нову математичну логіку.

Він лише говорить системі:

```text
який генератор використовувати
+
з якими налаштуваннями
```

Наприклад:

```json
{
  "id": "linear-equation"
}
```

працює лише тоді, коли `linear-equation` уже реалізований у коді.

Тому:

```text
Змінити параметри існуючих задач
            ↓
          JSON

Створити новий тип математичних задач
            ↓
Generator + Registry + Config + Tests
```

---

# Як створити новий курс

Створіть:

```text
data/my-course.json
```

Наприклад:

```json
{
  "id": "my-course",
  "name": "Мій курс математики",
  "description": "Власний курс",
  "topics": [
    {
      "id": "basic-equations",
      "name": "Прості рівняння",
      "generators": [
        {
          "id": "linear-equation",
          "config": {
            "answerRange": [-5, 5],
            "coefficientRange": [1, 5],
            "constantRange": [-10, 10],
            "forms": [
              "ax+b=c",
              "ax=b"
            ]
          }
        }
      ]
    }
  ]
}
```

---

# Реєстрація нового курсу

Відкрийте:

```text
data/activeCourse.ts
```

Імпортуйте файл:

```ts
import myCourse from './my-course.json';
```

Після цього додайте його до доступних курсів:

```ts
export const courses = {
  'nmt-math-2026': nmtCourse,
  'university-math': universityCourse,
  'my-course': myCourse,
} as const;
```

---

# Вибір активної бази

Для вибору курсу використовується:

```text
NEXT_PUBLIC_COURSE_ID
```

Для НМТ:

```env
NEXT_PUBLIC_COURSE_ID=nmt-math-2026
```

Для університетської математики:

```env
NEXT_PUBLIC_COURSE_ID=university-math
```

Для власної бази:

```env
NEXT_PUBLIC_COURSE_ID=my-course
```

---

# Зміна бази локально

Створіть:

```text
.env.local
```

Наприклад:

```env
NEXT_PUBLIC_COURSE_ID=university-math
```

Після зміни перезапустіть:

```bash
npm run dev
```

---

# Зміна бази на Vercel

Відкрийте:

```text
Vercel
↓
Project
↓
Settings
↓
Environment Variables
```

Створіть:

```text
NEXT_PUBLIC_COURSE_ID
```

Наприклад:

```text
nmt-math-2026
```

або:

```text
university-math
```

Після зміни потрібно виконати Redeploy.

---

# Як додати новий генератор

Якщо потрібно створити абсолютно новий тип задач:

```text
Новий Generator
       ↓
Generator Config
       ↓
Generator Registry
       ↓
Course JSON
       ↓
Tests
```

---

## Крок 1 — створити генератор

Наприклад:

```text
generators/myTopic/myGenerator.ts
```

Генератор має повертати:

```ts
Question
```

---

## Крок 2 — створити config

Наприклад:

```ts
export interface MyGeneratorConfig {
  valueRange: [number, number];
  forms: MyGeneratorForm[];
}
```

---

## Крок 3 — зареєструвати generator

У:

```text
engine/generatorRegistry.ts
```

потрібно зв'язати:

```text
generator ID
```

з:

```text
generator function
```

---

## Крок 4 — додати validation

Config повинен перевірятися.

Наприклад:

```text
range існує
min <= max
forms не порожній
form підтримується
required properties існують
```

---

## Крок 5 — додати в JSON

```json
{
  "id": "my-topic",
  "name": "Моя тема",
  "generators": [
    {
      "id": "my-generator",
      "config": {
        "valueRange": [1, 10],
        "forms": [
          "form-a",
          "form-b"
        ]
      }
    }
  ]
}
```

---

## Крок 6 — протестувати

Для нового генератора потрібно перевірити:

- генератор не падає
- `Question` валідний
- `correctAnswer` існує
- відповідь математично правильна
- options коректні
- немає порожніх options
- немає неправильних формул
- solution відповідає задачі
- stress generation працює

Після цього:

```bash
npm run test:full
```

---

# База курсу та дані користувача

Це дві різні системи.

## База математичного курсу

```text
data/course.json
data/university-math.json
```

Визначає:

```text
Теми
Генератори
Форми задач
Діапазони
Математичну конфігурацію
```

## Дані користувача

Зберігаються через:

```text
localStorage
```

Там можуть знаходитися:

```text
Історія
Результати
Прогрес
```

Тобто:

```text
JSON
=
що тренувати

localStorage
=
що вже пройшов користувач
```

---

# Встановлення

Клонувати:

```bash
git clone https://github.com/SuperCat2812/Nmt.git
```

Перейти до проєкту:

```bash
cd nmt-math-trainer
```

Встановити залежності:

```bash
npm install
```

Запустити:

```bash
npm run dev
```

---

# Команди

## Development

```bash
npm run dev
```

## ESLint

```bash
npm run lint
```

## TypeScript

```bash
npm run typecheck
```

## Vitest

```bash
npm run test
```

або:

```bash
npm run test:unit
```

Watch:

```bash
npm run test:watch
```

## Playwright

Усі E2E:

```bash
npm run test:e2e
```

UI:

```bash
npm run test:e2e:ui
```

Важливо використовувати саме:

```bash
npm run test:e2e:ui
```

а не:

```bash
npm test:e2e:ui
```

Headed:

```bash
npm run test:e2e:headed
```

Desktop Chromium:

```bash
npm run test:e2e:chromium
```

Mobile:

```bash
npm run test:e2e:mobile
```

## Build

```bash
npm run build
```

---

# Повна перевірка перед Deploy

Запустіть:

```bash
npm run test:full
```

Послідовність:

```text
ESLint
   ↓
TypeScript
   ↓
Vitest
   ↓
Playwright
   ↓
Next.js Build
```

---

# Formula Sanity Tests

Оскільки задачі генеруються випадково, формули також автоматично перевіряються.

Наприклад, тести можуть знаходити:

```text
+-
x--
NaN
Infinity
undefined
```

а також надто довгі десяткові числа:

```text
0.3333333333333333
```

Це допомагає знаходити рідкісні помилки генераторів.

---

# Generator Stress Tests

Генератори багаторазово запускаються з випадковими параметрами.

Stress-тести допомагають знаходити:

- crashes
- порожні options
- неправильні відповіді
- неправильні формули
- дублікати
- неправильні random ranges
- рідкісні математичні edge cases

---

# Playwright E2E

Playwright перевіряє застосунок як реальний користувач.

Перевіряються:

- вибір режиму
- вибір теми
- кількість задач
- запуск тренування
- відповіді
- перевірка відповіді
- solution
- наступне завдання
- завершення
- результати
- history
- reload
- desktop
- mobile
- overflow

---

# User Stress Tests

Окремо перевіряються складніші користувацькі сценарії:

- декілька задач з кожної теми
- 50 задач без зависання UI
- запуск 100 задач
- подвійний клік по «Перевірити»
- неможливість змінити відповідь після перевірки
- reload під час налаштування
- збереження history
- відсутність дублювання history
- horizontal overflow

---

# Перевірка всіх тем

Для кожної теми НМТ перевіряється повний цикл:

```text
Вибір теми
    ↓
Старт
    ↓
Генерація питання
    ↓
Відповідь
    ↓
Перевірка
    ↓
Feedback
    ↓
Розв'язання
    ↓
Наступне завдання
    ↓
Результат
```

Тести запускаються для desktop та mobile конфігурацій.

---

# Перед Deploy

Основна команда:

```bash
npm run test:full
```

За необхідності на Windows можна також очистити TypeScript build cache:

```powershell
Remove-Item tsconfig.tsbuildinfo -ErrorAction SilentlyContinue
npm run typecheck
```

Після успішного проходження:

```text
Lint
✓

TypeScript
✓

Unit / Integration
✓

Generator Stress
✓

Formula Sanity
✓

E2E
✓

Desktop
✓

Mobile
✓

Production Build
✓
```

проєкт можна відправляти на deploy.

---

# Збереження даних

У поточній версії дані користувача зберігаються через:

```text
localStorage
```

Переваги:

- backend не потрібен
- база даних не потрібна
- простий deploy
- швидке локальне збереження

Обмеження:

- дані прив'язані до браузера
- немає автоматичної синхронізації між пристроями

---

# Можливе підключення Backend

У майбутньому можна додати:

- Авторизацію
- User accounts
- Database
- Cloud history
- Синхронізацію
- Загальну статистику
- Leaderboard
- Teacher/student functionality

При цьому математичні генератори можуть залишитися незалежними від backend.

---

# Подальший розвиток

Можливі покращення:

- Авторизація
- Backend
- Database
- Cloud synchronization
- Нові типи завдань НМТ
- Нові генератори
- Рівні складності
- Таймер
- Повна симуляція НМТ
- Розширена статистика
- Нові графіки
- Accessibility
- Покращення mobile UI

---

# License

This project was created for educational purposes.
