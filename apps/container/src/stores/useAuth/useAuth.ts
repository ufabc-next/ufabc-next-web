import { authStore } from '@next/stores';
import create from 'vue-zustand';

const useAuth = create(authStore);

export default useAuth;
