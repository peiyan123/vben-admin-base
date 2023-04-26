import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const monitor: AppRouteModule = {
  path: '/monitor',
  name: 'Monitor',
  component: LAYOUT,
  redirect: '/monitor/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ant-design:dashboard-outlined',
    title: '智能监控',
    orderNo: 1,
  },
  children: [
    {
      path: 'index',
      name: 'MonitorPage',
      component: () => import('/@/views/monitor/index.vue'),
      meta: {
        title: '智能监控',
        icon: 'simple-icons:about-dot-me',
      },
    },
  ],
};

export default monitor;
