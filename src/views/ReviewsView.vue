<template>
  <v-layout class="flex-column align-center justify-center">
    <SearchBar />
    <TeacherReview
      v-if="router.currentRoute.value.query.teacherId"
      :id="router.currentRoute.value.query.teacherId.toString()"
    />
    <SubjectReview
      v-else-if="router.currentRoute.value.query.subjectId"
      :id="router.currentRoute.value.query.subjectId.toString()"
    />
    <ReviewsWelcome v-else />
  </v-layout>
</template>

<script setup lang="ts">
import ReviewsWelcome from '@/components/ReviewsWelcome.vue';
import TeacherReview from '@/components/TeacherReview.vue';
import SubjectReview from '@/components/SubjectReview.vue';
import router from '@/router';
import enrollment from '@/services/Enrollment';
import { useQuery } from '@tanstack/vue-query';
import SearchBar from '@/components/SearchBar.vue';

const {
  isError: isErrorEnrollment,
  isFetching: isFetchingEnrollment,
  data: enrollmentData,
  refetch: refetchEnrollment,
} = useQuery({
  refetchOnWindowFocus: false,
  queryKey: ['reviews', 'enrollment'],
  queryFn: enrollment.list,
});
</script>
