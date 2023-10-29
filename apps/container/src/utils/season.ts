const findQuadFromDate = (month: number): 1 | 2 | 3 => {
  if ([0, 1, 10, 11].includes(month)) return 1;
  if ([2, 3, 4, 5].includes(month)) return 2;
  return 3;
};

export const getSeason = (date = new Date()) => {
  const month = date.getMonth();
  return {
    1: {
      quad: 1,
      year: date.getFullYear() + (month < 6 ? 0 : 1),
    },
    2: {
      quad: 2,
      year: date.getFullYear(),
    },
    3: {
      quad: 3,
      year: date.getFullYear(),
    },
  }[findQuadFromDate(date.getMonth() || month)];
};
