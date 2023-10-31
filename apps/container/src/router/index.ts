import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { ReviewsView } from '@/views/Reviews';
import { PerformanceView } from '@/views/Performance';
import { PlanningView } from '@/views/Planning';
import { HistoryView } from '@/views/History';
import { StatsView } from '@/views/Stats';
import { SettingsView } from '@/views/Settings';
import { DonateView } from '@/views/Donate';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/reviews',
    name: 'reviews',
    component: ReviewsView,
  },
  {
    path: '/performance',
    name: 'performance',
    component: PerformanceView,
  },
  {
    path: '/planning',
    name: 'planning',
    component: PlanningView,
  },
  {
    path: '/history',
    name: 'history',
    component: HistoryView,
  },
  {
    path: '/stats',
    name: 'stats',
    component: StatsView,
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
  },
  {
    path: '/donate',
    name: 'donate',
    component: DonateView,
  },
  { path: '/:pathMatch(.*)*', redirect: '/reviews' },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
