import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ufabc.next.web',
  appName: 'ufabc-next-web',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
