import dayjs from 'dayjs';

// const findQuadFromDate = (month: number): 1 | 2 | 3 => {
//   if ([0, 1, 10, 11].includes(month)) return 1;
//   if ([2, 3, 4, 5].includes(month)) return 2;
//   return 3;
// };

// export const getSeason = (date = new Date()) => {
//   const month = date.getMonth();
//   return {
//     1: {
//       quad: 1,
//       year: date.getFullYear() + (month < 6 ? 0 : 1),
//     },
//     2: {
//       quad: 2,
//       year: date.getFullYear(),
//     },
//     3: {
//       quad: 3,
//       year: date.getFullYear(),
//     },
//   }[findQuadFromDate(date.getMonth() || month)];
// };

export const getSeason = (date = dayjs()) => {
  const year = date.year();
  const month = date.month();
  let quad;
  if (month < 4) {
    quad = 1;
  } else if (month < 8) {
    quad = 2;
  } else {
    quad = 3;
  }

  return `${year}:${quad}`;
};

type getElapsedSeasonsProps = {
  startSeason?: string;
  endSeason: string;
};

export const getElapsedSeasons = ({
  startSeason = '2019:1',
  endSeason,
}: getElapsedSeasonsProps) => {
  let currentSeason = startSeason;
  let seasons = [startSeason];
  while (currentSeason != endSeason) {
    let year = Number(currentSeason.split(':')[0]);
    let quad = Number(currentSeason.split(':')[1]);
    if (quad == 3) {
      quad = 1;
      year++;
    } else {
      quad++;
    }
    currentSeason = year + ':' + quad;
    seasons.push(currentSeason);
  }

  return seasons;
};

export const checkEAD = (year: string | number, quad: string | number) => {
  const possibles = getElapsedSeasons({
    startSeason: '2020:1',
    endSeason: '2022:2',
  });

  return possibles.includes(`${year}:${quad}`);
};

export const formatSeason = (season: string) => {
  const [year, quad] = season.split(':');
  return `Q${quad} ${year}`;
};

export const prettifySeason = (season: string) => {
  const [year, quad] = season.split(':');
  return `${quad}º quadrimestre de ${year}`;
};
