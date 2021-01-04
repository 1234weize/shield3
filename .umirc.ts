import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
  // devServer: {
  //   port: 8000,
  //   host: '192.168.1.52',
  //   https: true,
  // }
});
