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

import styles from './Trainer.module.css';

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
    <main className={styles.pageShell}>
      <header className={styles.header}>
        <div>
          <h1>{course.name}</h1>
        </div>
      </header>

      {!running && !finished && (
        <section className={`${styles.card} ${styles.setupCard}`}>
          <div className={styles.sectionHeading}>
            <h2>Налаштування тренування</h2>
          </div>

          <div className={styles.setupGrid}>
            <label className={styles.field}>
              <span>Режим</span>

              <select
                data-testid="training-mode"
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
              <label className={styles.field}>
                <span>Тема</span>

                <select
                  data-testid="single-topic-select"
                  value={selectedTopicIds[0] ?? ''}
                  onChange={(event) =>
                    setSelectedTopicIds([event.target.value])
                  }
                >
                  {courseTopics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <fieldset className={`${styles.field} ${styles.topicField}`}>
                <legend>Обери теми:</legend>

                <div className={styles.topicList}>
                  {courseTopics.map((topic) => (
                    <label
                      className={styles.topicOption}
                      key={topic.id}
                      data-testid="topic-option"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTopicIds.includes(topic.id)}
                        onChange={() => toggleTopic(topic.id)}
                      />

                      {topic.name}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <label className={styles.field}>
              <span>Кількість завдань</span>

              <input
                data-testid="question-count"
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

            <button
              className={styles.primaryButton}
              type="button"
              onClick={start}
              disabled={selectedTopicIds.length === 0}
            >
              Почати тренування <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      )}

      {running && currentQuestion && (
        <div className={styles.trainingArea}>
          <section
            className={styles.progressCard}
            aria-label="Прогрес тренування"
          >
            <div className={styles.progressTopline}>
              <p className={styles.progressLabel}>
                Завдання <strong>{currentNumber}</strong> з{' '}
                {session.settings.questionCount}
              </p>

              {remainingSeconds !== null && (
                <p className={styles.timer}>◷ {formatTime(remainingSeconds)}</p>
              )}
            </div>

            <progress
              className={styles.progressBar}
              max={session.settings.questionCount}
              value={session.answers.length}
            />

            <p className={styles.scoreLine}>
              <span className={styles.goodText}>
                ● {correctCount} правильно
              </span>

              <span className={styles.mutedText}>● {wrongCount} помилок</span>
            </p>
          </section>

          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            topicName={
              courseTopics.find((topic) => topic.id === currentQuestion.topicId)
                ?.name ?? currentQuestion.topicId
            }
            onAnswered={handleAnswered}
            onNext={next}
          />
        </div>
      )}

      {finished && session && (
        <section
          className={`${styles.card} ${styles.resultCard}`}
          data-testid="training-result"
        >
          <div className={styles.resultHeader}>
            <div>
              <p className={styles.kicker}>Сесію завершено</p>

              <h2>Твій результат</h2>
            </div>

            <div className={styles.scoreCircle}>
              <strong>{result.accuracy}%</strong>

              <span>точність</span>
            </div>
          </div>

          <div className={styles.statsGrid}>
            <div>
              <strong>
                {result.correct}/{result.total}
              </strong>

              <span>правильних відповідей</span>
            </div>

            <div>
              <strong>{result.incorrect}</strong>

              <span>помилок</span>
            </div>

            <div>
              <strong>{formatTime(result.elapsedSeconds)}</strong>

              <span>загальний час</span>
            </div>

            <div>
              <strong>{averageAnswerTime} с</strong>

              <span>середній час</span>
            </div>
          </div>

          {result.topicProgress.length > 0 && (
            <>
              <h3 className={styles.subheading}>Результат за темами</h3>

              <ul className={styles.topicResults}>
                {result.topicProgress.map((progress) => {
                  const topic = courseTopics.find(
                    (item) => item.id === progress.topicId,
                  );

                  return (
                    <li key={progress.topicId}>
                      <span>{topic?.name ?? progress.topicId}</span>

                      <strong>
                        {progress.correct}/{progress.answered}{' '}
                        <small>
                          ({progress.accuracy}
                          %)
                        </small>
                      </strong>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          <div className={styles.actionRow}>
            <button
              className={styles.primaryButton}
              type="button"
              onClick={repeatTraining}
            >
              Пройти ще раз
            </button>

            {result.incorrect > 0 && (
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={repeatMistakeTopics}
              >
                Повторити теми з помилками
              </button>
            )}

            <button
              className={styles.ghostButton}
              type="button"
              onClick={newTraining}
            >
              Нове тренування
            </button>
          </div>
        </section>
      )}

      {!running && history.length > 0 && (
        <section
          className={`${styles.card} ${styles.historyCard}`}
          data-testid="training-history"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.kicker}>Твоя статистика</p>

              <h2>Загальний прогрес</h2>
            </div>
          </div>

          <p className={styles.historyCount}>
            Всього тренувань: <strong>{history.length}</strong>
          </p>

          <ul className={styles.topicResults}>
            {lifetimeProgress.map((progress) => {
              const topic = courseTopics.find(
                (item) => item.id === progress.topicId,
              );

              return (
                <li key={progress.topicId}>
                  <span>
                    {topic?.name ?? progress.topicId}

                    <small>{progress.sessions} тренувань</small>
                  </span>

                  <strong>
                    {progress.correct}/{progress.answered}{' '}
                    <small>
                      ({progress.accuracy}
                      %)
                    </small>
                  </strong>
                </li>
              );
            })}
          </ul>

          <button
            className={styles.ghostButton}
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
