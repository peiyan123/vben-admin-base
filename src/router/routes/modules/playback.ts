import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const playback: AppRouteModule = {
  path: '/playback',
  name: 'Playback',
  component: LAYOUT,
  redirect: '/playback/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ant-design:insert-row-above-outlined',
    title: '本地回放',
    orderNo: 3,
  },
  children: [
    {
      path: 'index',
      name: 'PlaybackPage',
      component: () => import('/@/views/monitor/index.vue'),
      meta: {
        title: '本地回放',
        icon: 'simple-icons:about-dot-me',
      },
    },
  ],
};

export default playback;
