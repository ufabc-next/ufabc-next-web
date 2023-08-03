import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import ReviewsView from '../views/ReviewsView.vue';
import PerformanceView from '../views/PerformanceView.vue';
import RelationshipView from '../views/RelationshipView.vue';
import PlanningView from '../views/PlanningView.vue';
import HistoryView from '../views/HistoryView.vue';
import StatsView from '../views/StatsView.vue';
import SettingsView from '../views/SettingsView.vue';
import DonateView from '../views/DonateView.vue';

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
    path: '/relationship',
    name: 'relationship',
    component: RelationshipView,
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

  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
