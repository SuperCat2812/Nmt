# NMT Math Trainer

Interactive mathematics training application for preparation for the Ukrainian National Multi-Subject Test (NMT).

The application dynamically generates mathematics problems, checks answers, provides step-by-step solutions, tracks progress, and stores training history locally in the browser.

[English](#english) | [Українська](#українська)

---

# English

## About the Project

**NMT Math Trainer** is an interactive mathematics practice platform designed to help students prepare for the Ukrainian National Multi-Subject Test (NMT).

Instead of relying only on a fixed collection of questions, the application uses multiple mathematical generators to dynamically create new exercises.

Users can practice individual topics or combine several topics into a mixed training session.

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
- Training results and statistics
- Topic progress tracking
- Training history
- Browser persistence with `localStorage`
- Responsive interface
- Desktop and mobile support
- Automated unit and integration tests
- End-to-end browser testing with Playwright

## Supported Mathematics

The project contains generators for a wide range of mathematical topics, including:

- Fractions
- Percentages
- Powers and roots
- Algebraic expressions
- Linear equations
- Quadratic equations
- Rational equations
- Inequalities
- Functions
- Logarithms
- Sequences and progressions
- Trigonometry
- Plane geometry
- Solid geometry
- Vectors
- Combinatorics
- Probability
- Statistics

The project also contains generators for more advanced mathematical topics used for extended testing and development.

## Training Modes

### Single Topic

The user selects one mathematical topic and practices questions generated specifically for that topic.

### Mixed Mode

Several topics can be selected at the same time.

The trainer then generates a mixed training session containing questions from the selected topics.

## How It Works

The basic training flow is:

1. Select a training mode.
2. Select one or multiple topics.
3. Choose the number of questions.
4. Start the training session.
5. Answer generated questions.
6. Check the answer.
7. View the solution.
8. Continue to the next question.
9. Finish the session.
10. Review the results and training history.

## Question Generation

Questions are created dynamically by dedicated generators.

A generated question contains information such as:

- generator ID
- topic ID
- question type
- question text
- mathematical expression
- answer options
- correct answer
- solution steps
- unique variant key

Randomized generators are tested with thousands of generated questions to detect invalid mathematical cases.

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
│   ├── trigonometry/
│   ├── vectors/
│   └── ...
│
├── test/
│   ├── helpers/
│   └── ...
│
├── e2e/
│   └── ...
│
├── types/
├── utils/
├── playwright.config.ts
├── vitest.config.mts
├── package.json
└── README.md
```

## Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
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

Then open the local Next.js application in your browser.

## Available Commands

Start the development server:

```bash
npm run dev
```

Run unit and integration tests:

```bash
npm run test
```

Run Vitest in watch mode:

```bash
npm run test:watch
```

Run ESLint:

```bash
npm run lint
```

Check TypeScript:

```bash
npx tsc --noEmit
```

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Testing

The project uses two levels of automated testing.

### Vitest

Vitest tests mathematical generators and application logic.

The test suite checks, among other things:

- mathematical correctness
- fraction calculations
- equation generators
- function generators
- inequality generators
- percentage generators
- geometry generators
- trigonometry generators
- advanced mathematics generators
- answer validation
- course configuration
- training sessions
- training storage
- topic progress
- generated answer options

Run:

```bash
npm run test
```

Current verified result:

```text
Test Files  25 passed (25)
Tests       127 passed (127)
```

### Playwright

Playwright is used for end-to-end testing of real user interactions in the browser.

The E2E tests cover flows such as:

- opening the application
- selecting a training mode
- changing the number of questions
- selecting topics
- using mixed mode
- starting a training session
- interacting with questions
- completing training
- saving training history
- restoring history after page reload
- clearing history

Run all Playwright tests:

```bash
npx playwright test
```

Run tests visually:

```bash
npx playwright test --headed
```

Run Playwright UI mode:

```bash
npx playwright test --ui
```

Open the latest HTML report:

```bash
npx playwright show-report
```

## Full Project Check

Before committing or deploying changes, the main checks can be run with:

```powershell
Remove-Item tsconfig.tsbuildinfo -ErrorAction SilentlyContinue

npm run test
npm run lint
npx tsc --noEmit
npx playwright test
npm run build
```

This checks:

- mathematical logic
- application logic
- code quality
- TypeScript types
- browser user flows
- production build

## Data Storage

Training progress and history are currently stored in the browser using `localStorage`.

This means the current version does not require a backend server or database for basic operation.

A database can be added later if the project needs features such as:

- user accounts
- synchronization between devices
- cloud training history
- global statistics
- leaderboards

## Future Improvements

Possible future improvements include:

- User authentication
- Database integration
- Cloud progress synchronization
- More NMT question types
- More mathematical generators
- Difficulty levels
- Timed exam mode
- Full NMT simulation
- Detailed analytics
- Improved mobile experience

## Live Demo

Add the deployed application URL here:

```text
YOUR_DEPLOYMENT_URL
```

## Repository

```text
YOUR_REPOSITORY_URL
```

---

# Українська

## Про проєкт

**NMT Math Trainer** — інтерактивний тренажер з математики для підготовки до українського Національного мультипредметного тесту (НМТ).

Замість використання лише фіксованого набору завдань застосунок має математичні генератори, які динамічно створюють нові задачі.

Користувач може тренувати окрему тему або об'єднати декілька тем у змішане тренування.

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
- Підтримка desktop і mobile
- Автоматичні тести
- E2E-тестування через Playwright

## Математичні теми

Проєкт містить генератори для великої кількості тем, зокрема:

- Звичайні дроби
- Відсотки
- Степені та корені
- Алгебраїчні вирази
- Лінійні рівняння
- Квадратні рівняння
- Раціональні рівняння
- Нерівності
- Функції
- Логарифми
- Послідовності та прогресії
- Тригонометрія
- Планіметрія
- Стереометрія
- Вектори
- Комбінаторика
- Ймовірність
- Статистика

Також у проєкті є генератори складніших математичних тем для розширення та тестування системи.

## Режими тренування

### Одна тема

Користувач обирає одну математичну тему та отримує завдання саме з неї.

### Змішаний режим

Користувач може вибрати декілька тем.

Тренажер формує одну сесію із завдань вибраних категорій.

## Як працює тренування

Основний сценарій:

1. Обрати режим тренування.
2. Обрати тему або декілька тем.
3. Вказати кількість завдань.
4. Почати тренування.
5. Відповісти на завдання.
6. Перевірити відповідь.
7. Переглянути розв'язання.
8. Перейти до наступного завдання.
9. Завершити тренування.
10. Переглянути результат та історію.

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

## Встановлення

Клонуйте репозиторій:

```bash
git clone YOUR_REPOSITORY_URL
```

Перейдіть до папки:

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

## Тестування

### Vitest

Для перевірки математичної логіки та внутрішньої логіки застосунку:

```bash
npm run test
```

Поточний перевірений результат:

```text
Test Files  25 passed (25)
Tests       127 passed (127)
```

Генератори тестуються на великій кількості випадково створених завдань, що допомагає знаходити рідкісні помилки у випадкових комбінаціях.

### Playwright

Playwright перевіряє застосунок з точки зору реального користувача.

Наприклад:

- відкриття сторінки
- вибір режиму
- вибір тем
- змішаний режим
- запуск тренування
- проходження завдань
- завершення тренування
- збереження історії
- відновлення історії після перезавантаження
- очищення історії

Запуск:

```bash
npx playwright test
```

Візуальний запуск браузера:

```bash
npx playwright test --headed
```

Інтерактивний режим:

```bash
npx playwright test --ui
```

## Повна перевірка проєкту

Перед commit або deploy:

```powershell
Remove-Item tsconfig.tsbuildinfo -ErrorAction SilentlyContinue

npm run test
npm run lint
npx tsc --noEmit
npx playwright test
npm run build
```

Таким чином перевіряються:

- математичні генератори
- логіка застосунку
- ESLint
- TypeScript
- основні дії користувача
- production build

## Збереження даних

У поточній версії історія та прогрес зберігаються локально в браузері через `localStorage`.

Тому для базової роботи застосунку сервер і база даних не потрібні.

У майбутньому базу даних можна використати для:

- акаунтів користувачів
- синхронізації між пристроями
- хмарного збереження прогресу
- статистики
- рейтингу користувачів

## Подальший розвиток

Можливі наступні покращення:

- Авторизація користувачів
- Підключення бази даних
- Синхронізація прогресу
- Нові типи завдань НМТ
- Нові генератори
- Рівні складності
- Таймер
- Повна симуляція НМТ
- Розширена статистика
- Покращення мобільної версії

## Demo

```text
YOUR_DEPLOYMENT_URL
```

## Repository

```text
YOUR_REPOSITORY_URL
```

---

## License

This project was created for educational purposes.
