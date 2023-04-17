<template>
  <v-table density="comfortable" class="rounded-lg">
    <thead class="table-head bg-ufabcnext-green">
      <slot name="head"></slot>
    </thead>
    <tbody class="table-body bg-secondary">
      <slot name="body" style=""></slot>
    </tbody>
  </v-table>
</template>

<script setup lang="ts" />

<style>
.table-body > tr > td {
  outline: 1px solid white;
  text-align: center;
}
</style>
