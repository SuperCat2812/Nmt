import nmtCourse from './course.json';
import universityCourse from './university-math.json';

export const courses = {
  'nmt-math-2026': nmtCourse,
  'university-math': universityCourse,
} as const;

export type CourseId = keyof typeof courses;

export function isCourseId(value: string): value is CourseId {
  return value in courses;
}

function resolveActiveCourse(): CourseId {
  const envCourseId = process.env.NEXT_PUBLIC_COURSE_ID;

  if (!envCourseId) {
    return 'nmt-math-2026';
  }

  if (!isCourseId(envCourseId)) {
    throw new Error(
      `Невідомий NEXT_PUBLIC_COURSE_ID: "${envCourseId}". ` +
        `Доступні курси: ${Object.keys(courses).join(', ')}`,
    );
  }

  return envCourseId;
}

export const ACTIVE_COURSE = resolveActiveCourse();
