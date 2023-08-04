import { GradeData } from '@/types/teacher';

const transformGradeDataToObject = (grades: GradeData[], count: number) => {
  const result: { [x: string]: number } = {};
  grades.forEach((grade) => {
    result[grade.conceito] = (100 * grade.count) / count;
  });
  const ordered = Object.keys(result)
    .sort()
    .reduce((obj: typeof result, key) => {
      obj[key] = result[key];
      return obj;
    }, {});
  return ordered;
};

export default transformGradeDataToObject;
