import { handleCalendar } from './calendar';
import { definedQuarters } from './quarters';
import { parseSchedule, parseTimetableArray } from './scheduleParser';

const dayMap: Record<string, string> = {
  'seg': 'Segunda-feira',
  'ter': 'Terça-feira',
  'qua': 'Quarta-feira',
  'qui': 'Quinta-feira',
  'sex': 'Sexta-feira',
  'sab': 'Sábado',
};

const weekMap: Record<string, string> = {
  'Semanal': 'semanal',
  'Quinzenal I': 'quinzenal (I)',
  'Quinzenal II': 'quinzenal (II)'
};

export function exportTeamScheduleToICS(teamSchedules: any[], seasonStr: string = '2/2026') {
  // Encontra as datas do quadrimestre usando a mesma lógica do Calengrade
  const quarter = definedQuarters.find(q => q.title === seasonStr);
  if (!quarter) {
    throw new Error(`Datas para o quadrimestre ${seasonStr} não encontradas.`);
  }

  const mappedClasses: any[] = [];

  teamSchedules.forEach(student => {
    student.items.forEach((item: any) => {
      let slots: any[] = [];
      if (item.timetable) {
        slots.push(...parseTimetableArray(item.timetable, 'theory'));
        slots.push(...parseTimetableArray(item.timetable, 'practice'));
      } else {
        slots.push(...parseSchedule(item.teoria));
        slots.push(...parseSchedule(item.pratica));
      }

      if (slots.length === 0) return;

      const times = slots.map(s => {
        const startHour = String(s.time).padStart(2, '0');
        const endHour = String(s.time + (s.span || 1)).padStart(2, '0');

        return {
          day: dayMap[s.day] || 'Segunda-feira',
          start: `${startHour}:00`,
          end: `${endHour}:00`,
          repeat: weekMap[s.week] || 'semanal'
        };
      });

      // Se a aula ocupa mais de 1 hora consecutiva, os slots podem vir fragmentados.
      // Porém, o calendário do Google lidará melhor com eventos aglutinados.
      // Para manter simples (como o calengrade faz), apenas adicionamos os times como vieram (por hora ou bloco).

      mappedClasses.push({
        title: `${item.subject} (${student.name})`,
        campus: item.campus || 'N/A',
        info: [
          { title: 'Professor(a)', content: item.professor || 'Desconhecido' },
          { title: 'Membro', content: student.name },
          { title: 'RA', content: student.ra }
        ],
        times
      });
    });
  });

  const icsData = handleCalendar({
    classes: mappedClasses,
    startDate: quarter.startDate,
    endDate: quarter.endDate
  });

  if (!icsData) {
    throw new Error('Falha ao gerar o arquivo ICS.');
  }

  // Download logic
  const blob = new Blob([icsData as BlobPart], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `Agenda da Equipe - UFABC Next.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
