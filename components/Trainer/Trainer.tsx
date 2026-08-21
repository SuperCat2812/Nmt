'use client';

import { useEffect, useMemo, useState } from 'react';

import type { MatchingAnswer } from '@/types/question';

import type {
  TrainingResult,
  TrainingSession,
  TrainingSettings,
} from '@/types/training';

import type { UserAnswer } from '@/engine/answerChecker';

import { course, courseTopics } from '@/engine/courseManager';

import { resetQuestions } from '@/engine/questionManager';

import {
  calculateTrainingResult,
  createTrainingSession,
  finishTrainingSession,
  getRemainingSeconds,
  isTimeExpired,
  moveToNextQuestion,
  shouldFinishTraining,
  startTrainingSession,
  submitTrainingAnswer,
} from '@/engine/trainingSession';

import { generateTrainingQuestion } from '@/engine/trainingQuestionFactory';

import {
  addTrainingHistoryItem,
  clearTrainingHistory,
  loadTrainingHistory,
  type TrainingHistoryItem,
} from '@/engine/trainingStorage';

import { calculateLifetimeTopicProgress } from '@/engine/topicProgress';

import QuestionCard from '../QuestionCard/QuestionCard';

function serializeUserAnswer(answer: UserAnswer): string {
  if (typeof answer === 'string') {
    return answer;
  }

  const matching = answer as MatchingAnswer;

  return JSON.stringify(
    Object.fromEntries(
      Object.entries(matching).sort(([first], [second]) =>
        first.localeCompare(second),
      ),
    ),
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);

  const rest = seconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

export default function Trainer() {
  const [mode, setMode] = useState<TrainingSettings['mode']>('single-topic');

  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>(
    courseTopics[0] ? [courseTopics[0].id] : [],
  );

  const [questionCount, setQuestionCount] = useState(10);

  const [timeLimitSeconds, setTimeLimitSeconds] = useState<number | undefined>(
    undefined,
  );

  const [session, setSession] = useState<TrainingSession | null>(null);

  const [result, setResult] = useState<TrainingResult | null>(null);

  const [questionStartedAt, setQuestionStartedAt] = useState(0);

  const [now, setNow] = useState(Date.now());

  const [history, setHistory] = useState<TrainingHistoryItem[]>([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setHistory(loadTrainingHistory());
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);
  useEffect(() => {
    if (session?.status !== 'running') {
      return;
    }

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [session?.status]);

  const remainingSeconds = useMemo(() => {
    if (!session || session.status !== 'running') {
      return null;
    }

    return getRemainingSeconds(session, now);
  }, [session, now]);

  const lifetimeProgress = useMemo(
    () => calculateLifetimeTopicProgress(history),
    [history],
  );

  useEffect(() => {
    if (!session || session.status !== 'running') {
      return;
    }

    if (!isTimeExpired(session, now)) {
      return;
    }

    finishAndSave(session, now);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, session?.status]);

  function createSettings(): TrainingSettings {
    return {
      mode,

      questionCount,

      topicIds: selectedTopicIds,

      timeLimitSeconds,
    };
  }

  function startWithSettings(settings: TrainingSettings) {
    resetQuestions();

    const firstQuestion = generateTrainingQuestion(settings);

    const created = createTrainingSession(settings);

    const started = startTrainingSession(created, firstQuestion);

    setResult(null);

    setSession(started);

    const timestamp = Date.now();

    setNow(timestamp);

    setQuestionStartedAt(timestamp);
  }

  function start() {
    if (selectedTopicIds.length === 0) {
      return;
    }

    startWithSettings(createSettings());
  }

  function finishAndSave(
    currentSession: TrainingSession,
    finishedAt = Date.now(),
  ) {
    const finished = finishTrainingSession(currentSession, finishedAt);

    const finalResult = calculateTrainingResult(finished);

    setSession(finished);

    setResult(finalResult);

    if (finished.startedAt === null || finished.finishedAt === null) {
      return;
    }

    const nextHistory = addTrainingHistoryItem({
      id: finished.id,

      courseId: course.id,

      startedAt: finished.startedAt,

      finishedAt: finished.finishedAt,

      settings: finished.settings,

      result: finalResult,
    });

    setHistory(nextHistory);
  }

  function handleAnswered(isCorrect: boolean, userAnswer: UserAnswer) {
    if (!session || session.status !== 'running') {
      return;
    }

    const updated = submitTrainingAnswer(session, {
      userAnswer: serializeUserAnswer(userAnswer),

      isCorrect,

      questionStartedAt,

      answeredAt: Date.now(),
    });

    setSession(updated);
  }

  function next() {
    if (!session || session.status !== 'running') {
      return;
    }

    if (shouldFinishTraining(session)) {
      finishAndSave(session);

      return;
    }

    const nextQuestion = generateTrainingQuestion(session.settings);

    const nextSession = moveToNextQuestion(session, nextQuestion);

    setSession(nextSession);

    setQuestionStartedAt(Date.now());
  }

  function repeatTraining() {
    if (!session) {
      return;
    }

    startWithSettings(session.settings);
  }

  function repeatMistakeTopics() {
    if (!session) {
      return;
    }

    const mistakeTopicIds = Array.from(
      new Set(
        session.answers
          .filter((answer) => !answer.isCorrect)
          .map((answer) => answer.topicId),
      ),
    );

    if (mistakeTopicIds.length === 0) {
      return;
    }

    const settings: TrainingSettings = {
      mode: mistakeTopicIds.length === 1 ? 'single-topic' : 'mixed',

      questionCount: Math.max(
        5,
        session.answers.filter((answer) => !answer.isCorrect).length,
      ),

      topicIds: mistakeTopicIds,

      timeLimitSeconds: undefined,
    };

    setMode(settings.mode);

    setSelectedTopicIds(settings.topicIds);

    setQuestionCount(settings.questionCount);

    setTimeLimitSeconds(undefined);

    startWithSettings(settings);
  }

  function newTraining() {
    resetQuestions();

    setSession(null);

    setResult(null);

    setNow(Date.now());
  }

  function toggleTopic(topicId: string) {
    setSelectedTopicIds((previous) => {
      if (previous.includes(topicId)) {
        return previous.filter((id) => id !== topicId);
      }

      return [...previous, topicId];
    });
  }

  function changeMode(nextMode: TrainingSettings['mode']) {
    setMode(nextMode);

    if (nextMode === 'single-topic') {
      setSelectedTopicIds((previous) =>
        [previous[0] ?? courseTopics[0]?.id].filter((value): value is string =>
          Boolean(value),
        ),
      );
    }
  }

  const running = session?.status === 'running';

  const finished = session?.status === 'finished' && result !== null;

  const currentQuestion = session?.currentQuestion ?? null;

  const currentNumber = session ? session.currentQuestionIndex + 1 : 0;

  const correctCount =
    session?.answers.filter((answer) => answer.isCorrect).length ?? 0;

  const wrongCount =
    session?.answers.filter((answer) => !answer.isCorrect).length ?? 0;

  const averageAnswerTime =
    session && session.answers.length > 0
      ? Math.round(
          (session.answers.reduce(
            (total, answer) => total + answer.timeSpentSeconds,
            0,
          ) /
            session.answers.length) *
            10,
        ) / 10
      : 0;

  return (
    <main>
      <h1>{course.name}</h1>

      {!running && !finished && (
        <section>
          <h2>Налаштування тренування</h2>

          <label>
            Режим:
            <select
              value={mode}
              onChange={(event) =>
                changeMode(event.target.value as TrainingSettings['mode'])
              }
            >
              <option value="single-topic">Одна тема</option>

              <option value="mixed">Змішаний режим</option>
            </select>
          </label>

          {mode === 'single-topic' ? (
            <label>
              Обери тему:
              <select
                value={selectedTopicIds[0] ?? ''}
                onChange={(event) => setSelectedTopicIds([event.target.value])}
              >
                {courseTopics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <fieldset>
              <legend>Обери теми:</legend>

              {courseTopics.map((topic) => (
                <label key={topic.id}>
                  <input
                    type="checkbox"
                    checked={selectedTopicIds.includes(topic.id)}
                    onChange={() => toggleTopic(topic.id)}
                  />

                  {topic.name}
                </label>
              ))}
            </fieldset>
          )}

          <label>
            Кількість завдань:
            <input
              type="number"
              min="1"
              max="100"
              value={questionCount}
              onChange={(event) => {
                const value = Number(event.target.value);

                setQuestionCount(Math.min(100, Math.max(1, value || 1)));
              }}
            />
          </label>

          <label>
            Таймер:
            <select
              value={timeLimitSeconds ?? 0}
              onChange={(event) => {
                const value = Number(event.target.value);

                setTimeLimitSeconds(value > 0 ? value : undefined);
              }}
            >
              <option value={0}>Без таймера</option>

              <option value={300}>5 хвилин</option>

              <option value={600}>10 хвилин</option>

              <option value={1200}>20 хвилин</option>
            </select>
          </label>

          <button
            type="button"
            onClick={start}
            disabled={selectedTopicIds.length === 0}
          >
            Старт
          </button>
        </section>
      )}

      {running && currentQuestion && (
        <>
          <section>
            <p>
              Завдання {currentNumber}/{session.settings.questionCount}
            </p>

            <progress
              max={session.settings.questionCount}
              value={session.answers.length}
            />

            {remainingSeconds !== null && (
              <p>Залишилось: {formatTime(remainingSeconds)}</p>
            )}

            <p>
              Правильно: {correctCount} · Помилки: {wrongCount}
            </p>
          </section>

          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            onAnswered={handleAnswered}
            onNext={next}
          />
        </>
      )}

      {finished && session && (
        <section>
          <h2>Результат</h2>

          <p>
            Правильних відповідей: {result.correct} з {result.total}
          </p>

          <p>Точність: {result.accuracy}%</p>

          <p>Помилок: {result.incorrect}</p>

          <p>Час: {formatTime(result.elapsedSeconds)}</p>

          <p>Середній час відповіді: {averageAnswerTime} с</p>

          {result.topicProgress.length > 0 && (
            <>
              <h3>Результат за темами</h3>

              <ul>
                {result.topicProgress.map((progress) => {
                  const topic = courseTopics.find(
                    (item) => item.id === progress.topicId,
                  );

                  return (
                    <li key={progress.topicId}>
                      {topic?.name ?? progress.topicId}: {progress.correct}/
                      {progress.answered} ({progress.accuracy}
                      %)
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          <button type="button" onClick={repeatTraining}>
            Пройти ще раз
          </button>

          {result.incorrect > 0 && (
            <button type="button" onClick={repeatMistakeTopics}>
              Повторити теми з помилками
            </button>
          )}

          <button type="button" onClick={newTraining}>
            Нове тренування
          </button>
        </section>
      )}

      {history.length > 0 && (
        <section>
          <h2>Загальний прогрес</h2>

          <p>Тренувань: {history.length}</p>

          <ul>
            {lifetimeProgress.map((progress) => {
              const topic = courseTopics.find(
                (item) => item.id === progress.topicId,
              );

              return (
                <li key={progress.topicId}>
                  {topic?.name ?? progress.topicId}: {progress.correct}/
                  {progress.answered} ({progress.accuracy}
                  %), тренувань: {progress.sessions}
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={() => {
              clearTrainingHistory();

              setHistory([]);
            }}
          >
            Очистити історію
          </button>
        </section>
      )}
    </main>
  );
}
