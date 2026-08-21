import { describe, expect, it } from 'vitest';

import { validateCourse } from '@/engine/courseValidator';

describe('courseValidator', () => {
  it('приймає правильний мінімальний курс', () => {
    const course = {
      id: 'test-course',

      name: 'Test Course',

      topics: [
        {
          id: 'fractions',

          name: 'Fractions',

          generators: [
            {
              id: 'fraction',

              config: {
                numeratorRange: [1, 10],

                denominatorRange: [2, 10],

                allowNegative: false,

                allowImproper: false,

                forms: ['reduce'],
              },
            },
          ],
        },
      ],
    };

    expect(validateCourse(course)).toEqual(course);
  });

  it('відхиляє невідомий generator id', () => {
    const course = {
      id: 'test',
      name: 'Test',

      topics: [
        {
          id: 'topic',
          name: 'Topic',

          generators: [
            {
              id: 'unknown-generator',

              config: {},
            },
          ],
        },
      ],
    };

    expect(() => validateCourse(course)).toThrow(/не зареєстрований/);
  });

  it('відхиляє порожній список тем', () => {
    expect(() =>
      validateCourse({
        id: 'test',
        name: 'Test',
        topics: [],
      }),
    ).toThrow(/непорожнім масивом/);
  });

  it('відхиляє дублікати topic id', () => {
    const generator = {
      id: 'logarithm-equation',
    };

    expect(() =>
      validateCourse({
        id: 'test',
        name: 'Test',

        topics: [
          {
            id: 'same',
            name: 'A',

            generators: [generator],
          },

          {
            id: 'same',
            name: 'B',

            generators: [generator],
          },
        ],
      }),
    ).toThrow(/повторюється/);
  });

  it('відхиляє відсутній config', () => {
    expect(() =>
      validateCourse({
        id: 'test',
        name: 'Test',

        topics: [
          {
            id: 'fractions',

            name: 'Fractions',

            generators: [
              {
                id: 'fraction',
              },
            ],
          },
        ],
      }),
    ).toThrow(/відсутній config/);
  });

  it('дозволяє generator без config якщо він його не потребує', () => {
    const course = {
      id: 'test',
      name: 'Test',

      topics: [
        {
          id: 'logarithms',

          name: 'Logarithms',

          generators: [
            {
              id: 'logarithm-equation',
            },
          ],
        },
      ],
    };

    expect(validateCourse(course)).toEqual(course);
  });

  it('відхиляє неправильний range', () => {
    expect(() =>
      validateCourse({
        id: 'test',
        name: 'Test',

        topics: [
          {
            id: 'fractions',

            name: 'Fractions',

            generators: [
              {
                id: 'fraction',

                config: {
                  numeratorRange: [10, 1],

                  denominatorRange: [2, 10],

                  allowNegative: false,

                  allowImproper: false,

                  forms: ['reduce'],
                },
              },
            ],
          },
        ],
      }),
    ).toThrow(/min не може бути більшим за max/);
  });

  it('відхиляє range неправильного формату', () => {
    expect(() =>
      validateCourse({
        id: 'test',
        name: 'Test',

        topics: [
          {
            id: 'vectors',

            name: 'Vectors',

            generators: [
              {
                id: 'vector',

                config: {
                  coordinateRange: [1],

                  forms: ['coordinates-2d'],
                },
              },
            ],
          },
        ],
      }),
    ).toThrow(/\[min, max\]/);
  });

  it('відхиляє невідому форму', () => {
    expect(() =>
      validateCourse({
        id: 'test',
        name: 'Test',

        topics: [
          {
            id: 'fractions',

            name: 'Fractions',

            generators: [
              {
                id: 'fraction',

                config: {
                  numeratorRange: [1, 10],

                  denominatorRange: [2, 10],

                  allowNegative: false,

                  allowImproper: false,

                  forms: ['reduse'],
                },
              },
            ],
          },
        ],
      }),
    ).toThrow(/невідома форма "reduse"/);
  });

  it('відхиляє дублікати forms', () => {
    expect(() =>
      validateCourse({
        id: 'test',
        name: 'Test',

        topics: [
          {
            id: 'trigonometry',

            name: 'Trigonometry',

            generators: [
              {
                id: 'trigonometry',

                config: {
                  forms: ['identity', 'identity'],
                },
              },
            ],
          },
        ],
      }),
    ).toThrow(/повторюється/);
  });

  it('відхиляє неправильний boolean', () => {
    expect(() =>
      validateCourse({
        id: 'test',
        name: 'Test',

        topics: [
          {
            id: 'fractions',

            name: 'Fractions',

            generators: [
              {
                id: 'fraction',

                config: {
                  numeratorRange: [1, 10],

                  denominatorRange: [2, 10],

                  allowNegative: 'false',

                  allowImproper: false,

                  forms: ['reduce'],
                },
              },
            ],
          },
        ],
      }),
    ).toThrow(/allowNegative має бути boolean/);
  });

  it('відхиляє порожні forms', () => {
    expect(() =>
      validateCourse({
        id: 'test',
        name: 'Test',

        topics: [
          {
            id: 'probability',

            name: 'Probability',

            generators: [
              {
                id: 'probability',

                config: {
                  countRange: [2, 10],

                  forms: [],
                },
              },
            ],
          },
        ],
      }),
    ).toThrow(/непорожнім масивом/);
  });
  it('відхиляє невідоме поле config', () => {
    expect(() =>
      validateCourse({
        id: 'test',
        name: 'Test',

        topics: [
          {
            id: 'vectors',
            name: 'Vectors',

            generators: [
              {
                id: 'vector',

                config: {
                  coordinateRange: [-10, 10],

                  coordinatRange: [-5, 5],

                  forms: ['coordinates-2d'],
                },
              },
            ],
          },
        ],
      }),
    ).toThrow(/невідоме поле "coordinatRange"/);
  });
});
