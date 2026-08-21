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
- Stress testing of generators and user flows
- Production build validation

---

## Supported Mathematics

The NMT course contains generators for a wide range of school mathematics topics.

### Fractions

- fraction operations
- comparison
- simplification
- related fraction exercises

### Percentages

- percentage of a number
- finding a number from its percentage
- percentage increase
- percentage decrease
- percentage change
- ratios

### Powers and Roots

- powers
- roots
- exponent rules
- simplification

### Algebraic Expressions

- algebraic transformations
- identities
- difference of squares
- simplification of expressions

### Equations

- linear equations
- quadratic equations
- rational equations
- advanced equation forms

### Inequalities

- algebraic inequalities
- interval reasoning
- inequality transformations

### Functions

- function values
- function properties
- graph-related questions
- analytical interpretation

### Logarithms

- logarithmic expressions
- logarithmic equations
- logarithm properties

### Sequences and Progressions

- arithmetic progressions
- geometric progressions
- sequence terms
- progression formulas

### Trigonometry

- trigonometric values
- identities
- equations
- basic trigonometric relationships

### Plane Geometry

- triangles
- quadrilaterals
- circles
- areas
- perimeters
- extended geometry problems

### Solid Geometry

- three-dimensional figures
- volumes
- surface-related calculations
- spheres and other solids

### Vectors

- vector operations
- coordinates
- scalar products
- vector relationships

### Combinatorics

- counting problems
- permutations
- combinations
- related combinatorial calculations

### Probability

- basic probability
- event calculations
- probability problems

### Statistics

- statistical values
- data analysis
- basic descriptive statistics

---

## Advanced Mathematics

The project also contains generators for advanced mathematical topics used to extend and stress-test the generation architecture.

These include:

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

These generators demonstrate that the training architecture is not limited only to NMT mathematics.

---

## Training Modes

### Single Topic

The user selects one mathematical topic.

The trainer generates questions specifically for that topic.

Typical flow:

1. Select single-topic mode.
2. Select a topic.
3. Choose the number of questions.
4. Start training.
5. Answer the questions.
6. View the final result.

### Mixed Mode

Several topics can be selected simultaneously.

The trainer creates one training session containing questions from the selected categories.

This makes it possible to practice several areas of mathematics in one session.

---

## Training Flow

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
14. Review topic progress and training history.

---

## Question Generation

Questions are generated dynamically by dedicated mathematical generators.

A generated question can contain:

- unique question ID
- generator ID
- family ID
- variant key
- topic ID
- question type
- title
- question text
- mathematical expression
- answer options
- correct answer
- solution steps
- visual data

A simplified generated question may look like:

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
    // ...
  ],
  correctAnswer: '2',
  solution: [
    // ...
  ]
}
```

Randomized generators are tested with large numbers of generated questions to help detect rare invalid combinations.

---

## Answer Validation

The application supports several question formats.

### Single Choice

The user selects one answer from the generated options.

### Numeric Answer

The user enters a numerical result.

### Matching

The user matches elements from two sets.

The answer-checking engine validates the user response according to the question type.

---

## Step-by-Step Solutions

After checking an answer, the trainer displays:

- whether the answer is correct
- the correct answer when appropriate
- a separate solution section
- mathematical steps required to solve the problem

Mathematical expressions are rendered using KaTeX.

---

## Visualizations

Some mathematical questions can contain visual information.

The project uses visualization components for mathematical content such as:

- function graphs
- geometry
- charts
- other generated visual representations

The visualization stack includes:

- JSXGraph
- Recharts

---

## Progress and History

The application tracks training activity locally.

It can store information such as:

- completed training sessions
- results
- topic progress
- training history

Data is currently persisted using browser `localStorage`.

This allows the application to work without a backend server or database.

---

## Tech Stack

### Core

- Next.js 16
- React 19
- TypeScript

### Mathematics

- KaTeX
- React KaTeX
- MathJS
- JSXGraph

### Visualization

- Recharts

### Styling

- CSS Modules
- Global CSS

### Testing

- Vitest
- Playwright

### Development

- ESLint
- npm
- Git

### Deployment

- Vercel

---

## Project Structure

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
├── engine/
│   ├── answerChecker.ts
│   ├── generatorRegistry.ts
│   └── ...
│
├── generators/
│   ├── advancedCalculus/
│   ├── calculus/
│   ├── equations/
│   ├── expressions/
│   ├── fractions/
│   ├── functions/
│   ├── geometry/
│   ├── inequalities/
│   ├── powersRoots/
│   ├── probability/
│   ├── sequences/
│   ├── trigonometry/
│   ├── vectors/
│   └── ...
│
├── test/
│   ├── helpers/
│   └── ...
│
├── e2e/
│   ├── helpers.ts
│   ├── allTopics.spec.ts
│   ├── userStress.spec.ts
│   └── ...
│
├── types/
├── utils/
│
├── playwright.config.ts
├── vitest.config.mts
├── package.json
└── README.md
```

---

## Installation

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

Start the development server:

```bash
npm run dev
```

Then open the local application in your browser.

---

## Available Commands

### Development

Start the Next.js development server:

```bash
npm run dev
```

### Production Build

Create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

### ESLint

```bash
npm run lint
```

### TypeScript

```bash
npm run typecheck
```

### Vitest

Run unit and integration tests:

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

### Playwright

Run all E2E tests:

```bash
npm run test:e2e
```

Open Playwright UI mode:

```bash
npm run test:e2e:ui
```

Run tests in a visible browser:

```bash
npm run test:e2e:headed
```

Run Chromium tests:

```bash
npm run test:e2e:chromium
```

Run mobile tests:

```bash
npm run test:e2e:mobile
```

### Complete Project Check

Run the complete validation pipeline:

```bash
npm run test:full
```

This runs:

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

---

## Testing Strategy

The project uses several levels of automated validation.

### 1. TypeScript

TypeScript verifies the static type safety of the application.

Run:

```bash
npm run typecheck
```

---

### 2. ESLint

ESLint checks source-code quality and common programming problems.

Run:

```bash
npm run lint
```

---

### 3. Vitest

Vitest tests mathematical generators and internal application logic.

The tests cover areas such as:

- mathematical correctness
- generator output
- fraction calculations
- percentages
- expressions
- equations
- inequalities
- functions
- logarithms
- sequences
- trigonometry
- geometry
- vectors
- combinatorics
- probability
- statistics
- advanced mathematics
- answer validation
- training sessions
- storage
- progress calculations
- generated answer options
- formula sanity
- generator stress scenarios

Some generator tests create thousands of randomized questions to detect rare mathematical or generation errors.

Run:

```bash
npm run test
```

---

### 4. Formula Sanity Testing

Generated mathematical formulas are checked for suspicious output such as:

- malformed signs
- invalid expression formatting
- unexpectedly long floating-point representations
- malformed generated mathematical notation

This is especially useful because the application dynamically generates questions.

---

### 5. Generator Stress Testing

Generators are repeatedly executed with many randomized inputs.

This helps detect problems that may only occur for rare combinations of generated values.

Examples include:

- invalid answer options
- empty values
- malformed formulas
- duplicate or inconsistent answers
- invalid generated states

---

### 6. Playwright E2E Testing

Playwright tests the application from the perspective of a real browser user.

The E2E suite covers scenarios such as:

- opening the application
- selecting a mode
- selecting topics
- changing the number of questions
- starting training
- answering questions
- checking answers
- viewing solutions
- moving to the next question
- completing training
- viewing results
- saving history
- restoring state after reload
- avoiding duplicate history entries
- mixed-topic training
- desktop layouts
- mobile layouts
- horizontal overflow checks
- repeated user interactions

---

### 7. User Stress Scenarios

The E2E suite also contains stress-oriented user scenarios.

Examples include:

- completing several questions from every NMT topic
- completing 50 questions without UI freezing
- starting a 100-question training session
- double-clicking the answer-check button
- attempting to change an answer after it has been checked
- reloading the page during configuration
- checking history persistence
- checking that reload does not duplicate history
- checking horizontal overflow after multiple questions

These tests help validate the application beyond the normal "happy path".

---

### 8. Desktop and Mobile Testing

Playwright contains separate projects for desktop Chromium and mobile viewport testing.

Run desktop Chromium:

```bash
npm run test:e2e:chromium
```

Run mobile:

```bash
npm run test:e2e:mobile
```

This helps ensure that the trainer remains usable across different screen sizes.

---

## Pre-Deployment Check

Before deployment, run:

```bash
npm run test:full
```

For an additional clean TypeScript check on Windows:

```powershell
Remove-Item tsconfig.tsbuildinfo -ErrorAction SilentlyContinue
npm run typecheck
```

The deployment checklist therefore validates:

- source-code quality
- TypeScript
- mathematical logic
- generator logic
- answer validation
- application state
- browser user flows
- desktop behavior
- mobile behavior
- production compilation

---

## Data Storage

Training progress and history are currently stored in the browser using:

```text
localStorage
```

Therefore, the current version does not require a backend server or database for its basic functionality.

### Advantages

- simple deployment
- no server required
- fast local persistence
- training history survives page reloads

### Limitation

The data belongs to the current browser/device.

It is not currently synchronized between different devices.

---

## Possible Backend Expansion

A backend and database can be added in the future for features such as:

- user accounts
- authentication
- cloud training history
- synchronization between devices
- global statistics
- leaderboards
- shared progress
- teacher/student functionality

The current generator architecture can continue working independently of the storage layer.

---

## Future Improvements

Possible future improvements include:

- user authentication
- database integration
- cloud progress synchronization
- additional NMT question types
- additional mathematical generators
- difficulty levels
- timed exam mode
- full NMT simulation
- detailed analytics
- additional visualizations
- accessibility improvements
- further mobile optimization

---

# Українська

## Про проєкт

**NMT Math Trainer** — інтерактивний математичний тренажер для підготовки до українського Національного мультипредметного тесту (НМТ).

На відміну від застосунків, які використовують лише фіксований набір запитань, NMT Math Trainer використовує математичні генератори для динамічного створення нових завдань.

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

## Можливості

- Тренування однієї теми
- Змішаний режим
- Динамічна генерація математичних завдань
- Налаштування кількості завдань
- Завдання з вибором відповіді
- Завдання з числовою відповіддю
- Завдання на встановлення відповідності
- Автоматична перевірка відповідей
- Покрокові розв'язання
- Відображення математичних формул через KaTeX
- Візуалізація функцій і геометрії
- Результати тренування
- Статистика
- Прогрес за темами
- Історія тренувань
- Збереження даних у `localStorage`
- Адаптивний інтерфейс
- Desktop-версія
- Mobile-версія
- Автоматичне тестування математичної логіки
- Unit та integration-тести через Vitest
- E2E-тестування через Playwright
- Окремі desktop та mobile E2E-проєкти
- Stress-тестування генераторів
- Stress-тестування користувацьких сценаріїв
- Перевірка production build

---

## Математичні теми НМТ

Тренажер містить генератори для основних математичних тем.

### Звичайні дроби

- операції з дробами
- порівняння
- скорочення
- пов'язані задачі з дробами

### Відсотки

- відсоток від числа
- знаходження числа за відсотком
- збільшення на відсоток
- зменшення на відсоток
- відсоткова зміна
- відношення

### Степені та корені

- степені
- корені
- властивості степенів
- спрощення

### Алгебраїчні вирази

- перетворення виразів
- тотожності
- різниця квадратів
- спрощення виразів

### Рівняння

- лінійні рівняння
- квадратні рівняння
- раціональні рівняння
- складніші види рівнянь

### Нерівності

- алгебраїчні нерівності
- інтервали
- перетворення нерівностей

### Функції

- значення функції
- властивості функцій
- графічні завдання
- аналіз функцій

### Логарифми

- логарифмічні вирази
- логарифмічні рівняння
- властивості логарифмів

### Послідовності та прогресії

- арифметична прогресія
- геометрична прогресія
- члени послідовностей
- формули прогресій

### Тригонометрія

- тригонометричні значення
- тотожності
- рівняння
- основні тригонометричні співвідношення

### Планіметрія

- трикутники
- чотирикутники
- кола
- площі
- периметри
- розширені геометричні задачі

### Стереометрія

- просторові фігури
- об'єми
- площі поверхонь
- сфери та інші тіла

### Вектори

- операції з векторами
- координати
- скалярний добуток
- співвідношення між векторами

### Комбінаторика

- задачі на підрахунок
- перестановки
- комбінації
- комбінаторні обчислення

### Ймовірність

- базова ймовірність
- події
- задачі на обчислення ймовірності

### Статистика

- статистичні величини
- аналіз даних
- базова описова статистика

---

## Розширена математика

У проєкті також є генератори складніших математичних тем, які використовуються для розширення та stress-тестування архітектури:

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

Це демонструє, що архітектура генераторів не обмежується лише програмою НМТ.

---

## Режими тренування

### Одна тема

Користувач обирає одну математичну тему.

Тренажер створює завдання саме з цієї теми.

Основний сценарій:

1. Обрати режим однієї теми.
2. Обрати тему.
3. Вказати кількість завдань.
4. Почати тренування.
5. Виконати завдання.
6. Переглянути результат.

### Змішаний режим

Користувач може обрати декілька тем одночасно.

Тренажер формує одну сесію із завдань вибраних категорій.

---

## Як працює тренування

Основний сценарій користувача:

1. Відкрити тренажер.
2. Обрати режим.
3. Обрати одну або декілька тем.
4. Вказати кількість завдань.
5. Почати тренування.
6. Прочитати згенероване завдання.
7. Обрати або ввести відповідь.
8. Натиснути «Перевірити».
9. Побачити результат перевірки.
10. Переглянути покрокове розв'язання.
11. Перейти до наступного завдання.
12. Завершити тренування.
13. Переглянути результат.
14. Переглянути прогрес та історію.

---

## Генерація завдань

Завдання створюються динамічно спеціалізованими математичними генераторами.

Згенероване завдання може містити:

- унікальний ID
- ID генератора
- family ID
- variant key
- ID теми
- тип завдання
- заголовок
- текст
- математичну формулу
- варіанти відповідей
- правильну відповідь
- кроки розв'язання
- дані для візуалізації

Генератори тестуються на великій кількості випадково створених завдань.

Це допомагає знаходити рідкісні помилки у випадкових комбінаціях.

---

## Перевірка відповідей

Тренажер підтримує декілька форматів завдань.

### Вибір відповіді

Користувач обирає один варіант із запропонованих.

### Числова відповідь

Користувач самостійно вводить числовий результат.

### Встановлення відповідності

Користувач встановлює відповідність між елементами двох наборів.

Система перевірки відповіді враховує тип конкретного завдання.

---

## Покрокове розв'язання

Після перевірки відповіді користувач бачить:

- правильна відповідь чи ні
- правильну відповідь, коли це необхідно
- окремий блок розв'язання
- математичні кроки

Формули відображаються за допомогою KaTeX.

---

## Прогрес та історія

Тренажер локально зберігає інформацію про навчання.

Зберігатися можуть:

- завершені тренування
- результати
- прогрес за темами
- історія тренувань

Для збереження використовується браузерний `localStorage`.

---

## Технології

### Основні

- Next.js 16
- React 19
- TypeScript

### Математика

- KaTeX
- React KaTeX
- MathJS
- JSXGraph

### Візуалізація

- Recharts

### Стилізація

- CSS Modules
- Global CSS

### Тестування

- Vitest
- Playwright

### Розробка

- ESLint
- npm
- Git

### Deploy

- Vercel

---

## Встановлення

Клонуйте репозиторій:

```bash
git clone https://github.com/SuperCat2812/Nmt.git
```

Перейдіть до папки проєкту:

```bash
cd nmt-math-trainer
```

Встановіть залежності:

```bash
npm install
```

Запустіть dev-сервер:

```bash
npm run dev
```

---

## Команди

### Dev-сервер

```bash
npm run dev
```

### ESLint

```bash
npm run lint
```

### TypeScript

```bash
npm run typecheck
```

### Vitest

```bash
npm run test
```

або:

```bash
npm run test:unit
```

Watch mode:

```bash
npm run test:watch
```

### Playwright

Усі E2E-тести:

```bash
npm run test:e2e
```

Playwright UI:

```bash
npm run test:e2e:ui
```

Видимий браузер:

```bash
npm run test:e2e:headed
```

Chromium:

```bash
npm run test:e2e:chromium
```

Mobile:

```bash
npm run test:e2e:mobile
```

### Production Build

```bash
npm run build
```

### Повна перевірка

```bash
npm run test:full
```

---

## Система тестування

Проєкт використовує декілька рівнів автоматичної перевірки.

### TypeScript

Перевіряє типи та допомагає знаходити помилки ще до запуску застосунку.

```bash
npm run typecheck
```

### ESLint

Перевіряє якість коду та потенційні проблеми.

```bash
npm run lint
```

### Vitest

Vitest використовується для перевірки математичних генераторів та внутрішньої логіки застосунку.

Перевіряються, зокрема:

- математична коректність
- генератори дробів
- відсотки
- степені та корені
- вирази
- рівняння
- нерівності
- функції
- логарифми
- послідовності
- тригонометрія
- геометрія
- вектори
- комбінаторика
- ймовірність
- статистика
- складні математичні генератори
- перевірка відповідей
- тренувальні сесії
- storage
- прогрес
- варіанти відповідей
- коректність формул
- stress-сценарії генераторів

Частина тестів генерує тисячі випадкових задач для пошуку рідкісних математичних помилок.

---

## Formula Sanity Tests

Автоматичні тести перевіряють згенеровані формули на підозрілі конструкції, наприклад:

- некоректні знаки
- неправильне форматування
- надто довгі десяткові числа
- пошкоджений математичний запис

Це особливо важливо для системи з випадковою генерацією завдань.

---

## Generator Stress Tests

Генератори багаторазово запускаються з випадковими значеннями.

Це допомагає знайти проблеми, які можуть виникати лише в рідкісних комбінаціях.

Наприклад:

- порожні варіанти відповіді
- неправильні значення
- некоректні формули
- дублікати
- суперечливі відповіді
- неправильний стан згенерованого завдання

---

## Playwright E2E

Playwright перевіряє застосунок з точки зору реального користувача.

Перевіряються:

- відкриття застосунку
- вибір режиму
- вибір тем
- кількість завдань
- змішаний режим
- запуск тренування
- відповіді на завдання
- перевірка відповіді
- перегляд розв'язання
- перехід до наступного завдання
- завершення тренування
- результати
- історія
- відновлення після reload
- відсутність дублювання історії
- desktop
- mobile
- horizontal overflow
- багаторазові взаємодії користувача

---

## User Stress Tests

Окремі E2E-сценарії перевіряють поведінку застосунку при тривалішому використанні.

Серед них:

- декілька задач підряд з кожної теми НМТ
- проходження 50 задач без зависання UI
- запуск тренування зі 100 задач
- подвійне натискання «Перевірити»
- блокування зміни відповіді після перевірки
- reload під час налаштування
- збереження історії
- відсутність дублювання історії після reload
- перевірка horizontal overflow після декількох завдань

---

## Desktop та Mobile

Playwright містить окремі конфігурації для desktop Chromium та mobile.

Desktop:

```bash
npm run test:e2e:chromium
```

Mobile:

```bash
npm run test:e2e:mobile
```

Це дозволяє автоматично перевіряти адаптивність основних користувацьких сценаріїв.

---

## Перевірка перед Deploy

Перед commit або deploy достатньо виконати:

```bash
npm run test:full
```

Ця команда послідовно запускає:

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

Таким чином перевіряються:

- якість коду
- TypeScript
- математична логіка
- генератори
- перевірка відповідей
- внутрішня логіка застосунку
- користувацькі сценарії
- desktop
- mobile
- production build

---

## Збереження даних

У поточній версії прогрес та історія тренувань зберігаються локально в браузері через:

```text
localStorage
```

Тому для базової роботи застосунку не потрібні:

- backend
- база даних
- авторизація

Дані зберігаються на поточному пристрої та в поточному браузері.

---

## Можливе підключення Backend

У майбутньому backend і базу даних можна використати для:

- акаунтів користувачів
- авторизації
- синхронізації між пристроями
- хмарної історії тренувань
- глобальної статистики
- рейтингу користувачів
- спільного прогресу
- функціоналу викладач/учень

При цьому математичні генератори можуть залишатися незалежними від способу збереження даних.

---

## Подальший розвиток

Можливі наступні покращення:

- авторизація користувачів
- база даних
- синхронізація прогресу
- нові типи завдань НМТ
- нові генератори
- рівні складності
- таймер
- повна симуляція НМТ
- розширена статистика
- додаткові візуалізації
- accessibility
- подальше покращення mobile UI

---

## License

This project was created for educational purposes.
