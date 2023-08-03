<template>
  <v-row align="start" justify="start">
    <v-col
      sm=""
      order="1"
      class="mr-3 justify-center pa-0 flex-grow-0 flex-shrink-1"
    >
      <div
        :style="conceptStyle"
        class="text-white d-flex align-center justify-center rounded-lg"
      >
        {{ comment?.enrollment.conceito }}
      </div>
      <p class="text-primary" style="white-space: nowrap">
        {{ `Q${season.split(':')[1]} ${season.split(':')[0]}` }}
      </p>
    </v-col>
    <v-col
      cols="12"
      sm=""
      order="3"
      order-sm="2"
      class="comment-text-container mr-2 pa-0"
      :style="`max-height: ${expanded || smAndDown ? 'unset' : '80px'}`"
    >
      <div>
        <p class="text-primary pt-2 pt-sm-0">
          <v-chip
            v-if="isEAD"
            density="compact"
            class="px-2"
            style="font-size: 12px"
            >EAD</v-chip
          >
          {{ comment?.subject.name }}
        </p>
        <p ref="commentText">
          {{ comment?.comment }}
        </p>
        <button
          class="show-more text-primary text-subtitle-2"
          :style="`display:${expanded || smAndDown ? 'none' : 'block'}`"
          @click="showMore"
        >
          MOSTRAR MAIS
          <v-icon>mdi-chevron-down</v-icon>
        </button>
      </div>
    </v-col>
    <v-col
      sm=""
      order="2"
      order-sm="3"
      class="pa-0 justify-start text-subtitle-2 text-next-light-gray flex-grow-0 flex-shrink-1"
    >
      <div class="d-flex">
        <v-btn
          :loading="isLoadingLike"
          @click="
            props.comment?.myReactions.like ? mutateRemoveLike() : mutateLike()
          "
          class="icon-button text-subtitle-2"
          variant="text"
          :icon="
            props.comment?.myReactions.like
              ? 'mdi-thumb-up'
              : 'mdi-thumb-up-outline'
          "
          :color="props.comment?.myReactions.like ? 'primary' : ''"
        >
          <v-icon size="small" class="mr-1" />
          {{ `${props.comment?.reactionsCount?.like || 0}` }}
        </v-btn>
        <v-btn
          :loading="isLoadingRecommendation"
          @click="
            props.comment?.myReactions.recommendation
              ? mutateRemoveRecommendation()
              : mutateRecommendation()
          "
          class="ml-1 icon-button text-subtitle-2"
          variant="text"
          :icon="
            props.comment?.myReactions.recommendation
              ? 'mdi-medal'
              : 'mdi-medal-outline'
          "
          :color="props.comment?.myReactions.recommendation ? 'primary' : ''"
        >
          <v-icon size="small" class="mr-1" />
          {{ `${props.comment?.reactionsCount?.recommendation || 0}` }}
        </v-btn>
      </div>
      Há {{ date }}
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { conceptsColor } from '@/utils/consts';
import { PropType, computed, onMounted, ref } from 'vue';
import { Comment } from '@/types/comments';
import { ElMessage } from 'element-plus';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import comments from '@/services/Comment';
import transformDataToTimeAgo from '@/utils/transformDataToTimeAgo';
import { RequestError } from '@/types/request-error';
import { AxiosError } from 'axios';
import { useDisplay } from 'vuetify';
const { smAndDown } = useDisplay();

const conceptStyle = computed(() => {
  return {
    backgroundColor: conceptsColor[props.comment?.enrollment.conceito ?? ''],
    height: '54px',
    width: '54px',
    fontSize: '34px',
  };
});

const props = defineProps({
  comment: {
    type: Object as PropType<Comment>,
    required: true,
  },
});

const queryClient = useQueryClient();
const { mutate: mutateLike, isLoading: isLoadingLike } = useMutation({
  mutationFn: () => comments.like(props.comment?._id),
  onSuccess: () => {
    queryClient.invalidateQueries(['comments']);
  },
  onError: (error: AxiosError<RequestError>) => {
    ElMessage.error(error.response?.data.error);
  },
});

const { mutate: mutateRecommendation, isLoading: isLoadingRecommendation } =
  useMutation({
    mutationFn: () => comments.recommendation(props.comment?._id),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments']);
    },
    onError: (error: AxiosError<RequestError>) => {
      ElMessage.error(error.response?.data.error);
    },
  });

const { mutate: mutateRemoveLike } = useMutation({
  mutationFn: () => comments.removeLike(props.comment?._id),
  onSuccess: () => {
    queryClient.invalidateQueries(['comments']);
  },
  onError: (error: AxiosError<RequestError>) => {
    ElMessage.error(error.response?.data.error);
  },
});

const { mutate: mutateRemoveRecommendation } = useMutation({
  mutationFn: () => comments.removeRecommendation(props.comment?._id),
  onSuccess: () => {
    queryClient.invalidateQueries(['comments']);
  },
  onError: (error: AxiosError<RequestError>) => {
    ElMessage.error(error.response?.data.error);
  },
});

const date = computed(() => {
  return transformDataToTimeAgo(props.comment?.createdAt);
});

const season = computed(() => {
  if (!props.comment || !props.comment.enrollment) return '';
  if (!props.comment.enrollment.season && !props.comment.enrollment.year)
    return '';

  return (
    props.comment.enrollment.season ??
    props.comment.enrollment.year + ':' + props.comment.enrollment.quad
  );
});

const isEAD = computed(() => {
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
  return possibles.includes(season.value);
});

const expanded = ref(false);
const commentText = ref<HTMLElement | null>(null);

const showMore = () => {
  if (!commentText.value) return;
  expanded.value = true;
};
onMounted(() => {
  if (!commentText.value) return;
  if (commentText.value.clientHeight <= 60) {
    expanded.value = true;
  }
});
</script>

<style scoped lang="scss">
.comment-text-container {
  overflow: hidden;
  transition: max-height 0.5s ease-in-out;
  font-size: 14px;
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  position: relative;
}
.show-more {
  position: absolute;
  width: 100%;
  top: 60px;
  background-image: linear-gradient(to right, transparent, white 40%);
}
.v-btn--icon.v-btn--density-default.icon-button {
  height: 36px;
  width: 36px;
}
</style>
