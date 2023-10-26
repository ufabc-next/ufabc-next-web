import { ConceptData } from 'types';

const transformConceptDataToObject = (grades: ConceptData[], count: number) => {
  const result: { [x: string]: number } = {};
  grades.forEach((grade) => {
    result[grade.conceito] = grade.count;
  });
  const ordered = Object.keys(result)
    .sort()
    .reduce((obj: typeof result, key) => {
      obj[key] = result[key];
      return obj;
    }, {});
  return ordered;
};

export default transformConceptDataToObject;
