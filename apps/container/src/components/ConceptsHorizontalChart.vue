<template>
  <div class="grading">
    <el-tooltip
      v-for="grade in orderedDistribution"
      placement="top"
      :key="grade.conceito"
      :hide-after="0"
      :content="`
        ${grade.conceito}: ${grades[grade.conceito].toFixed(1)}% (${
          grade.count
        } notas)`"
    >
      <span
        class="grading-segment"
        :class="grade.count < unthrustableThreshold ? 'unthrustable' : ''"
        :style="{
          background:
            conceptsColor[grade.conceito as keyof typeof conceptsColor],
          width: `${grades[grade.conceito]}%`,
        }"
      >
      </span>
    </el-tooltip>

    <span
      v-if="gradeData.count < unthrustableThreshold"
      class="low-samples text-body-2"
      >Dados sem muitas amostras</span
    >
  </div>
</template>

<script setup lang="ts">
import { conceptsColor } from 'consts';
import { ConceptData, SubjectSpecific } from 'types';
import { transformConceptDataToObject } from 'utils';
import { computed, PropType } from 'vue';

const props = defineProps({
  gradeData: { type: Object as PropType<SubjectSpecific>, required: true },
});

const unthrustableThreshold = 10;

const orderedDistribution = computed(() => {
  const distribution: ConceptData[] = JSON.parse(
    JSON.stringify(props.gradeData.distribution),
  );
  return distribution.sort((a, b) => a.conceito.localeCompare(b.conceito));
});

const grades = computed(() =>
  transformConceptDataToObject(
    props.gradeData.distribution,
    props.gradeData.count,
  ),
);
</script>

<style scoped>
.unthrustable {
  opacity: 0.4;
}

.grading-segment {
  height: 100%;
  flex: 1 1 auto;
  transition:
    opacity 0.2s ease-in-out,
    width 0.9s ease-in-out;
}

.grading {
  width: 100%;
  border-radius: 4px;
  height: 28px;
  overflow: hidden;
  position: relative;
  display: flex;
  min-width: 200px;
}

.grading:hover .grading-segment {
  opacity: 0.7;
}

.grading-segment:hover {
  opacity: 1 !important;
}
.low-samples {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.26);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.4);
}
.grading:hover .low-samples {
  display: none;
}
</style>
