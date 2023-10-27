export const checkEAD = (year: string | number, quad: string | number) => {
    const possibles = [
        '2020:1',
        '2020:2',
        '2020:3',
        '2021:1',
        '2021:2',
        '2021:3',
        '2022:1',
        '2022:2',
      ];
      return possibles.includes(
        `${year}:${quad}`,
      );
}

export const formatSeason = (quad: string | number, year: string | number) => `Q${quad} ${year}`
