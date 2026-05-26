export interface Timeslot {
  day: string;
  time: number;
  week: string;
  room?: string;
}

export function parseTimetableArray(timetable: any[], type: 'theory' | 'practice'): Timeslot[] {
  const filtered = timetable.filter(item => item.scheduleType === type);
  const slots: Timeslot[] = [];

  for (const item of filtered) {
    let periodicity = "Semanal";
    const freq = (item.frequency || '').toLowerCase();
    const unp = (item.unparsed || '').toLowerCase();

    if (item.periodicity === "fortnightly_1" || (freq.includes("quinzenal i") && !freq.includes("quinzenal ii")) || (unp.includes("quinzenal i") && !unp.includes("quinzenal ii"))) {
      periodicity = "Quinzenal I";
    } else if (item.periodicity === "fortnightly_2" || freq.includes("quinzenal ii") || unp.includes("quinzenal ii")) {
      periodicity = "Quinzenal II";
    }

    const startHour = parseInt(item.startTime.split(':')[0], 10);
    const endHour = parseInt(item.endTime.split(':')[0], 10);
    
    let day = item.dayOfTheWeek.toLowerCase();
    if (day === 'monday') day = 'seg';
    else if (day === 'tuesday') day = 'ter';
    else if (day === 'wednesday') day = 'qua';
    else if (day === 'thursday') day = 'qui';
    else if (day === 'friday') day = 'sex';
    else if (day === 'saturday') day = 'sab';

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push({
        day,
        time: hour,
        week: periodicity,
        room: item.classroomCode || ''
      });
    }
  }

  return slots;
}

export function parseSchedule(schedule: string | null): Timeslot[] {
  if (!schedule) return [];

  const scheduleParts = schedule.split(';').map(part => part.trim()).filter(Boolean);

  return scheduleParts.flatMap(part => {
    const [timePart, weekPartRaw] = part.split(',').map(subPart => subPart.trim());
    const weekLabel = weekPartRaw
      ? weekPartRaw[0].toUpperCase() + weekPartRaw.slice(1)
      : 'Semanal';

    const dayMap: Record<string, string> = {
      'segunda': 'seg', 'terça': 'ter', 'terca': 'ter',
      'quarta': 'qua', 'quinta': 'qui', 'sexta': 'sex',
      'sábado': 'sab', 'sabado': 'sab',
    };

    let dayInPortuguese = '';
    let startHour = 0;
    let endHour = 0;

    const timePartLower = timePart.toLowerCase();
    
    // Suporta formato longo: "Segunda das 19:00 às 21:00"
    const matchComplete = /(\w+)\s+das\s+(\d+):\d+\s+às\s+(\d+):\d+/.exec(timePartLower);
    
    if (matchComplete) {
      dayInPortuguese = matchComplete[1];
      startHour = parseInt(matchComplete[2], 10);
      endHour = parseInt(matchComplete[3], 10);
    } else {
      return [];
    }

    const dayCode = dayMap[dayInPortuguese] ?? dayInPortuguese;

    let periodicity = "Semanal";
    const partLower = part.toLowerCase();
    if (partLower.includes("quinzenal ii")) periodicity = "Quinzenal II";
    else if (partLower.includes("quinzenal i")) periodicity = "Quinzenal I";

    const slots: Timeslot[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push({ day: dayCode, time: hour, week: periodicity });
    }

    return slots;
  });
}

/** Extrai as iniciais maiúsculas de um nome, preservando numerais romanos ou números no final. */
export function getIniciais(name: string) {
  if (!name) return '';

  const nameParts = name.trim().split(/\s+/);
  const romanNumeralRegex = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i;

  const isNumericOrRoman = (text: string) =>
      /^\d+$/.test(text) || (romanNumeralRegex.test(text) && text !== '');

  let suffix: string | undefined;
  const lastWord = nameParts[nameParts.length - 1];

  if (lastWord && isNumericOrRoman(lastWord)) {
      suffix = nameParts.pop();
  }
  const initials = nameParts
      .filter(part => /^\p{Lu}/u.test(part)) // Matches uppercase unicode letters
      .map(part => part[0])
      .join('');

  return suffix ? `${initials} ${suffix}` : initials;
}

/** Retorna o primeiro e o segundo nome de uma string. */
export function getPrimeiroNome(fullName: string) {
  if (!fullName) return '';
  const parts = formatName(fullName).split(' ');
  return parts[0] + (parts[1] ? ' ' + parts[1] : '');
}

/** Formata nomes em Title Case respeitando exceções em português e numerais romanos. */
export function formatName(text: string) {
  if (!text) return '';
  const exceptions = ['de', 'da', 'do', 'das', 'dos', 'e', 'às', 'aos', 'em', 'para', 'com', 'sem', 'sob', 'sobre', 'a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas', 'por', 'ou', 'na', 'no', 'nas', 'nos'];
  const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];

  return text.toLowerCase().split(' ').map((word, index) => {
    if (romanNumerals.includes(word)) return word.toUpperCase();
    if (index > 0 && exceptions.includes(word)) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}


