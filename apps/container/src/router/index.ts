import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { ReviewsView } from '@/views/Reviews';
import { PerformanceView } from '@/views/Performance';
import { PlanningView } from '@/views/Planning';
import { HistoryView } from '@/views/History';
import { StatsView } from '@/views/Stats';
import { SettingsView } from '@/views/Settings';
import { DonateView } from '@/views/Donate';
import { authStore } from 'stores';
import { SignUpView } from '@/views/SignUp';
import { ConfirmView } from '@/views/Confirm';
import { RecoveryView } from '@/views/Recovery';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/reviews',
    name: 'reviews',
    component: ReviewsView,
    meta: {
      title: 'Reviews',
      auth: true,
    },
  },
  {
    path: '/performance',
    name: 'performance',
    component: PerformanceView,
    meta: {
      title: 'Performance',
      auth: true,
    },
  },
  {
    path: '/planning',
    name: 'planning',
    component: PlanningView,
    meta: {
      title: 'Planejamento',
      auth: true,
    },
  },
  {
    path: '/history',
    name: 'history',
    component: HistoryView,
    meta: {
      title: 'Meu Histórico',
      auth: true,
    },
  },
  {
    path: '/stats',
    name: 'stats',
    component: StatsView,
    meta: {
      title: 'Dados da Matrícula',
      auth: true,
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: {
      title: 'Configurações',
      auth: true,
    },
  },
  {
    path: '/donate',
    name: 'donate',
    component: DonateView,
    meta: {
      title: 'Ajude o Next',
    },
  },
  {
    name: 'signup',
    path: '/signup',
    component: SignUpView,
    meta: {
      title: 'Cadastro',
    },
    props: true,
  },
  {
    name: 'confirm',
    path: '/confirm',
    component: ConfirmView,
    meta: {
      title: 'Confirmação da conta',
    },
  },

  {
    path: '/recovery',
    name: 'recovery',
    component: RecoveryView,
    meta: {
      title: 'Recuperar conta',
    },
  },

  { path: '/:pathMatch(.*)*', redirect: '/reviews' },
];

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_BASE_URL),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  document.title = (to.meta.title as string) || 'UFABC Next';
  if (to.matched.some((record) => record.meta.auth)) {
    if (authStore.getState().token) {
      next();
    } else {
      if (process.env.VUE_APP_MF_ENV !== 'local') {
        window.location.pathname = '/';
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;
