<template>
  <div class="team-schedule-grid mt-1 bg-white rounded-xl shadow-sm border border-grey-lighten-2 pa-6">
    <div class="d-flex align-center justify-space-between mb-4 flex-wrap gap-4">
      <h2 class="text-h5 font-weight-bold d-flex flex-wrap align-center gap-4 mb-0">
        Quadro de Horários
      </h2>
      <v-switch
        v-model="isDetailedMode"
        label="Modo Detalhado"
        hide-details
        density="compact"
        color="primary"
        class="flex-grow-0"
      ></v-switch>
    </div>

    <div class="overflow-x-auto">
      <table class="w-100 text-left border-collapse" style="min-width: 800px">
        <thead>
          <tr>
            <th class="pa-4 bg-grey-lighten-4 border font-weight-medium text-grey-darken-2" style="width: 80px">
              Horário
            </th>
            <th v-for="day in activeWeekDays" :key="day.id" class="pa-4 bg-grey-lighten-4 border text-capitalize font-weight-medium text-grey-darken-2">
              {{ day.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hour in timeSlots" :key="hour">
            <td class="text-center px-1 py-1 border text-caption text-grey-darken-1 font-weight-medium" style="width: 80px">
              {{ hour }}:00 às {{ hour + 1 }}:00
            </td>
            
            <template v-for="day in activeWeekDays" :key="day.id">
              <td 
                v-if="!shouldSkip(day.id, hour)"
                class="pa-1 border position-relative" 
                :rowspan="getSpanLength(day.id, hour)"
                style="vertical-align: top; width: 18%"
              >
                <div class="d-flex flex-column gap-1 h-100">
                  <template v-if="slotsByTime[day.id] && slotsByTime[day.id][hour]">
                    <!-- NORMAL MODE: 1 subject -->
                    <template v-if="slotsByTime[day.id][hour].length === 1">
                      <div
                        v-for="(slotData, index) in slotsByTime[day.id][hour]"
                        :key="index"
                        class="pa-2 h-100 flex-grow-1 rounded-lg"
                        :style="{ backgroundColor: getSubjectColor(slotData.subject), border: '1px solid rgba(0,0,0,0.05)' }"
                      >
                        <div v-if="isDetailedMode" class="d-flex flex-column mb-1">
                          <div class="d-flex align-start justify-space-between mb-1">
                            <div class="text-caption font-mono text-grey-darken-2" style="font-size: 10px">{{ slotData.turma }}</div>
                            <v-btn
                              v-if="slotData.groupURL"
                              :href="slotData.groupURL"
                              target="_blank"
                              icon="mdi-whatsapp"
                              size="x-small"
                              variant="text"
                              color="success"
                              density="compact"
                            />
                          </div>
                          <div class="text-body-2 font-weight-medium mb-1 line-clamp-2" :title="slotData.subject" style="line-height: 1.2">
                            {{ slotData.subject }}
                          </div>
                          <div class="text-caption text-grey-darken-2 mb-1" style="font-size: 11px">
                            {{ slotData.professor || 'Sem professor' }}
                          </div>
                          <div class="text-caption text-grey-darken-2 mb-1 d-flex align-center gap-1" style="font-size: 11px">
                            <v-icon size="x-small">mdi-map-marker</v-icon>
                            <span class="text-uppercase">{{ slotData.campus }}</span>
                            <span class="ml-1 font-weight-medium">Sala: {{ slotData.sala || '—' }}</span>
                          </div>
                          <div class="text-caption text-grey-darken-1 mb-1" style="font-size: 10px">
                            {{ slotData.startTime }}:00 às {{ slotData.endTime }}:00
                          </div>
                          <div class="d-flex align-center gap-2 mb-2">
                            <span class="text-caption text-grey-darken-1">{{ slotData.turno === 'diurno' ? 'Matutino' : 'Noturno' }}</span>
                            <span class="px-1 rounded bg-white border font-weight-bold text-uppercase" style="font-size: 9px; letter-spacing: 0.5px">
                              {{ slotData.isPractice ? 'Prática' : 'Teoria' }}
                            </span>
                          </div>
                        </div>
                        
                        <!-- Students Footer and Periodicity -->
                      <div class="d-flex flex-column pt-2 mt-auto" :class="{ 'border-t': isDetailedMode }" :style="isDetailedMode ? 'border-top: 1px solid rgba(0,0,0,0.05)' : ''">
                        <div class="d-flex align-center justify-space-between mb-1" style="gap: 4px;">
                          <div class="d-flex flex-wrap gap-1">
                            <v-chip
                              v-for="student in slotData.students"
                              :key="student.ra"
                              size="x-small"
                              variant="flat"
                              color="white"
                              class="px-2 font-weight-medium elevation-1"
                            >
                              {{ student.name }}
                            </v-chip>
                          </div>
                          
                          <span class="text-caption text-grey-darken-1 text-no-wrap" style="font-size: 10px">{{ slotData.periodicity }}</span>
                        </div>
                      </div>
                      </div>
                    </template>

                    <!-- COMPACT/CONFLICT MODE: > 1 subject -->
                    <template v-else>
                      <div
                        v-for="(slotData, index) in slotsByTime[day.id][hour]"
                        :key="index"
                        class="pa-2 h-100 rounded d-flex flex-column"
                        :style="{ backgroundColor: getSubjectColor(slotData.subject) }"
                        style="transition: all 0.2s ease"
                      >
                        <div v-if="isDetailedMode" class="d-flex flex-column mb-1">
                          <div class="d-flex justify-space-between align-center mb-1">
                            <div class="text-caption font-weight-bold text-truncate" :title="slotData.subject" style="font-size: 11px">
                              {{ getIniciais(slotData.subject) }}
                            </div>
                            <v-btn
                              v-if="slotData.groupURL"
                              :href="slotData.groupURL"
                              target="_blank"
                              icon="mdi-whatsapp"
                              size="x-small"
                              variant="text"
                              color="success"
                              density="compact"
                              style="height: 16px; width: 16px"
                            />
                          </div>
                          <div class="text-caption text-grey-darken-2 d-flex align-center gap-1 mb-1" style="font-size: 9px; line-height: 1; width: 100%">
                            <v-icon size="8" class="flex-shrink-0">mdi-map-marker</v-icon>
                            <span class="text-uppercase text-truncate" style="max-width: 100%" :title="`${slotData.campus} S: ${slotData.sala || '—'}`">
                              {{ slotData.campus }} S: {{ slotData.sala || '—' }}
                            </span>
                          </div>
                          <div class="text-caption text-grey-darken-2 mb-1 text-truncate" style="font-size: 9px; line-height: 1" :title="slotData.professor">
                            {{ slotData.professor || 'Sem prof.' }}
                          </div>
                        </div>
                        <div class="d-flex align-center flex-wrap mt-auto" style="gap: 2px">
                          <v-chip
                            v-for="student in slotData.students"
                            :key="student.ra"
                            size="x-small"
                            variant="flat"
                            color="white"
                            class="px-1"
                            style="font-size: 9px; height: 16px"
                          >
                            {{ student.name }}
                          </v-chip>
                        </div>
                      </div>
                    </template>
                  </template>
                </div>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { parseSchedule, parseTimetableArray, getIniciais, getPrimeiroNome, formatName } from '@/utils/scheduleParser';

export interface ScheduleItem {
  season: string;
  groupURL?: string;
  codigo: string;
  campus?: string;
  turma?: string;
  turno?: string;
  subject: string;
  professor?: string;
  teoria: string | null;
  pratica: string | null;
  uf_cod_turma?: string;
  sala?: string;
  timetable?: any[];
  category?: string;
  [key: string]: any;
}

export interface StudentSchedule {
  ra: string;
  name: string;
  items: ScheduleItem[];
}

const props = defineProps<{
  schedules: StudentSchedule[];
}>();

const isDetailedMode = ref(true);

const ALL_WEEK_DAYS = [
  { id: 'seg', label: 'segunda' },
  { id: 'ter', label: 'terça' },
  { id: 'qua', label: 'quarta' },
  { id: 'qui', label: 'quinta' },
  { id: 'sex', label: 'sexta' },
  { id: 'sab', label: 'sábado' },
];

const activeWeekDays = computed(() => {
  return ALL_WEEK_DAYS.filter(day => {
    const daySlots = slotsByTime.value[day.id];
    if (!daySlots) return false;
    return Object.values(daySlots).some((slotsArr: any) => slotsArr.length > 0);
  });
});

const timeSlots = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

const subjectColors = [
  '#FEE2E2', // red-100
  '#FFEDD5', // orange-100
  '#FEF3C7', // amber-100
  '#FEF08A', // yellow-200
  '#ECFCCB', // lime-100
  '#D1FAE5', // emerald-100
  '#CCFBF1', // teal-100
  '#CFFAFE', // cyan-100
  '#E0F2FE', // sky-100
  '#DBEAFE', // blue-100
  '#E0E7FF', // indigo-100
  '#EDE9FE', // violet-100
  '#F3E8FF', // purple-100
  '#FAE8FF', // fuchsia-100
  '#FCE7F3', // pink-100
  '#FFE4E6', // rose-100
  '#E2E8F0', // slate-200
];
const subjectColorMap = new Map<string, string>();

function getSubjectColor(subject: string) {
  if (!subjectColorMap.has(subject)) {
    let hash = 0;
    for (let i = 0; i < subject.length; i++) {
      hash = subject.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % subjectColors.length;
    subjectColorMap.set(subject, subjectColors[colorIndex]);
  }
  return subjectColorMap.get(subject);
}

interface ParsedSlot {
  subject: string;
  turma: string;
  professor: string;
  sala: string;
  campus: string;
  turno: string;
  isPractice: boolean;
  startTime: number;
  endTime: number;
  span: number;
  groupURL: string;
  periodicity: string;
  category?: string;
  students: Map<string, string>;
}

// Compute all slots organized by day and hour
const parsedEvents = computed(() => {
  const cellMap = new Map<string, ParsedSlot>();

  props.schedules.forEach(student => {
    student.items.forEach(item => {
      const mapSlots = (parsedSlots: any[], isPractice: boolean) => {
        const blocks = parsedSlots.reduce((acc: any[], slot) => {
          const last = acc[acc.length - 1];
          if (last && last.day === slot.day && last.end === slot.time && last.periodicity === slot.week && last.room === slot.room) {
            last.end = slot.time + 1;
            last.span += 1;
          } else {
            acc.push({
              day: slot.day,
              start: slot.time,
              end: slot.time + 1,
              span: 1,
              periodicity: slot.week,
              room: slot.room || ''
            });
          }
          return acc;
        }, []);

        blocks.forEach(block => {
          const key = `${block.day}-${block.start}-${item.subject}-${isPractice}`;
          if (!cellMap.has(key)) {
            cellMap.set(key, { 
              subject: formatName(item.subject), 
              turma: item.uf_cod_turma || item.codigo,
              professor: formatName(item.professor || ''),
              sala: block.room || item.sala || '',
              campus: item.campus || '',
              turno: item.turno || '',
              category: item.category,
              isPractice,
              startTime: block.start,
              endTime: block.end,
              span: block.span,
              groupURL: item.groupURL || '',
              periodicity: block.periodicity,
              students: new Map() 
            });
          }
          cellMap.get(key)!.students.set(student.ra, student.name);
        });
      };

      if (item.timetable) {
        mapSlots(parseTimetableArray(item.timetable, 'theory'), false);
        mapSlots(parseTimetableArray(item.timetable, 'practice'), true);
      } else {
        mapSlots(parseSchedule(item.teoria), false);
        mapSlots(parseSchedule(item.pratica), true);
      }
    });
  });

  return cellMap;
});

const slotsByTime = computed(() => {
  const result: Record<string, Record<number, any[]>> = {};
  
  ALL_WEEK_DAYS.forEach(d => {
    result[d.id] = {};
    timeSlots.forEach(h => {
      result[d.id][h] = [];
    });
  });

  parsedEvents.value.forEach((value, key) => {
    const [day, timeStr] = key.split('-');
    const time = parseInt(timeStr, 10);
    
    if (result[day] && result[day][time]) {
      result[day][time].push({
        ...value,
        students: Array.from(value.students.entries()).map(([ra, name]) => ({ ra, name }))
      });
    }
  });

  return result;
});

// A computed property that calculates max spans and cells to skip.
// Since getSpanLength uses side effects in a reactive way usually, we'll pre-calculate it cleanly.
const tableLayout = computed(() => {
  const skipMatrix: Record<string, Record<number, boolean>> = {};
  const spanMatrix: Record<string, Record<number, number>> = {};

  ALL_WEEK_DAYS.forEach(d => {
    skipMatrix[d.id] = {};
    spanMatrix[d.id] = {};
    timeSlots.forEach(h => {
      skipMatrix[d.id][h] = false;
      spanMatrix[d.id][h] = 1;
    });
  });

  ALL_WEEK_DAYS.forEach(d => {
    timeSlots.forEach(h => {
      if (skipMatrix[d.id][h]) return;
      
      const events = slotsByTime.value[d.id]?.[h];
      if (events && events.length > 0) {
        const maxSpan = Math.max(...events.map(e => e.span));
        spanMatrix[d.id][h] = maxSpan;
        
        for (let i = 1; i < maxSpan; i++) {
          if (timeSlots.includes(h + i)) {
            skipMatrix[d.id][h + i] = true;
          }
        }
      }
    });
  });

  return { skipMatrix, spanMatrix };
});

function shouldSkip(day: string, hour: number) {
  return tableLayout.value.skipMatrix[day][hour];
}

function getSpanLength(day: string, hour: number) {
  return tableLayout.value.spanMatrix[day][hour];
}
</script>

<style scoped>
.border-collapse {
  border-collapse: collapse;
}
.border {
  border: 1px solid #e0e0e0;
}
.gap-1 {
  gap: 4px;
}
.gap-2 {
  gap: 8px;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.font-mono {
  font-family: monospace;
}
</style>
