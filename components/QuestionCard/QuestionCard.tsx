'use client';

import { useState } from 'react';

import type { MatchingAnswer, MatchingItem, Question } from '@/types/question';

import { checkAnswer, type UserAnswer } from '@/engine/answerChecker';

import MathFormula from '../MathFormula/MathFormula';

import VisualRenderer from '../VisualRenderer/VisualRenderer';

type Props = {
  question: Question;

  onAnswered: (correct: boolean, userAnswer: UserAnswer) => void;

  onNext: () => void;
};

export default function QuestionCard({ question, onAnswered, onNext }: Props) {
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const [checked, setChecked] = useState(false);

  const [matchingAnswer, setMatchingAnswer] = useState<MatchingAnswer>({});

  const userAnswer: UserAnswer =
    question.type === 'matching' ? matchingAnswer : selectedAnswer;

  const isCorrect = checkAnswer(question, userAnswer);

  function handleCheck() {
    if (question.type === 'matching') {
      if (!question.matching) {
        return;
      }

      const allAnswered = question.matching.left.every(
        (item) => matchingAnswer[item.id],
      );

      if (!allAnswered) {
        return;
      }
    } else if (!selectedAnswer.trim()) {
      return;
    }

    setChecked(true);

    onAnswered(isCorrect, userAnswer);
  }

  function handleNext() {
    setSelectedAnswer('');

    setMatchingAnswer({});

    setChecked(false);

    onNext();
  }

  function MatchingItemContent({ item }: { item: MatchingItem }) {
    return (
      <>
        {item.text && <span>{item.text}</span>}

        {item.math && <MathFormula math={item.math} />}
      </>
    );
  }

  return (
    <section>
      <h2>{question.title}</h2>

      {question.text && <p>{question.text}</p>}

      {question.math && <MathFormula math={question.math} />}

      {question.visual && <VisualRenderer visual={question.visual} />}

      {question.type === 'single-choice' && (
        <div>
          {question.options?.map((option) => (
            <button
              key={option.id}
              type="button"
              disabled={checked}
              onClick={() => setSelectedAnswer(option.value)}
            >
              {option.text && <span>{option.text}</span>}

              {option.math && <MathFormula math={option.math} />}
            </button>
          ))}
        </div>
      )}

      {question.type === 'numeric' && (
        <div>
          <label>
            Ваша відповідь:
            <input
              type="text"
              inputMode="decimal"
              value={selectedAnswer}
              disabled={checked}
              onChange={(event) => setSelectedAnswer(event.target.value)}
            />
          </label>
        </div>
      )}

      {question.type === 'matching' && question.matching && (
        <div>
          {question.matching.left.map((leftItem) => (
            <div key={leftItem.id}>
              <MatchingItemContent item={leftItem} />

              <select
                value={matchingAnswer[leftItem.id] ?? ''}
                disabled={checked}
                onChange={(event) =>
                  setMatchingAnswer((previous) => ({
                    ...previous,

                    [leftItem.id]: event.target.value,
                  }))
                }
              >
                <option value="">Оберіть відповідність</option>

                {question.matching!.right.map((rightItem) => (
                  <option key={rightItem.id} value={rightItem.id}>
                    {rightItem.text ?? rightItem.math ?? rightItem.id}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {!checked && (
        <button type="button" onClick={handleCheck}>
          Перевірити
        </button>
      )}

      {checked && (
        <>
          <p>{isCorrect ? '✅ Правильно!' : '❌ Неправильно'}</p>

          {!isCorrect && question.type !== 'matching' && (
            <p>Правильна відповідь: {String(question.correctAnswer)}</p>
          )}

          <h3>Розв&apos;язання</h3>

          <ol>
            {question.solution.map((step, index) => (
              <li key={index}>
                {step.text && <span>{step.text}</span>}

                {step.math && <MathFormula math={step.math} />}
              </li>
            ))}
          </ol>

          <button type="button" onClick={handleNext}>
            Наступне завдання
          </button>
        </>
      )}
    </section>
  );
}
