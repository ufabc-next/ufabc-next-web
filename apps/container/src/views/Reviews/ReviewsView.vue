<template>
  <v-layout class="flex-column align-center justify-center">
    <SearchBar />
    <TeacherReview
      v-if="router.currentRoute.value.query.teacherId"
      :teacherId="router.currentRoute.value.query.teacherId.toString()"
      :key="router.currentRoute.value.query.teacherId.toString()"
    />
    <SubjectReview
      v-else-if="router.currentRoute.value.query.subjectId"
      :subjectId="router.currentRoute.value.query.subjectId.toString()"
      :key="router.currentRoute.value.query.subjectId.toString()"
    />
    <div v-else class="w-100 d-flex flex-column align-center">
      <WelcomeMessage />
      <PendingReviewEnrollmentsList />
    </div>
  </v-layout>
</template>

<script setup lang="ts">
import WelcomeMessage from '@/components/WelcomeMessage.vue';
import SearchBar from '@/components/SearchBar.vue';
import SubjectReview from '@/components/SubjectReview.vue';
import TeacherReview from '@/components/TeacherReview.vue';
import router from '@/router';
import PendingReviewEnrollmentsList from '@/components/PendingReviewEnrollmentsList.vue';
</script>
