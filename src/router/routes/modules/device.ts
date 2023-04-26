import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const device: AppRouteModule = {
  path: '/device',
  name: 'Device',
  component: LAYOUT,
  redirect: '/device/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ant-design:edit-filled',
    title: '设备管理',
    orderNo: 2,
  },
  children: [
    {
      path: 'index',
      name: 'DevicePage',
      component: () => import('/@/views/device/index.vue'),
      meta: {
        title: '设备管理',
        icon: 'simple-icons:about-dot-me',
      },
    },
  ],
};

export default device;
