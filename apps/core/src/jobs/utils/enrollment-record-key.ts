// Class codes identify offerings within a season. Without one, retain the exact
// source subject code; never deduplicate by a student's RA or name.
export function enrollmentRecordKey(
  year: string | number,
  quad: string | number,
  subjectCode: string,
  classCode?: string | null
) {
  const hasClass = classCode && !['-', '--'].includes(classCode);
  return JSON.stringify([
    String(year),
    String(quad),
    hasClass ? 'class' : 'subject',
    hasClass ? classCode : subjectCode,
  ]);
}
