import api from './api';

type QuadInformation = {
  accumulated_credits: number;
  ca_acumulado: number;
  ca_quad: number;
  cp_acumulado: number;
  cr_acumulado: number;
  cr_quad: number;
  percentage_approved: number;
  period_credits: number;
  quad: number;
  season: string;
  year: number;
};

type CrDistributionData = {
  point: string;
  total: number;
  _id: string;
};

const performanceService = {
  getCrHistory: () => api.get<QuadInformation[]>('users/me/grades'),
  getCrDistribution: () => api.get<CrDistributionData[]>('stats/grades'),
};

export default performanceService;
