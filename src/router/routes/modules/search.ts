import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const search: AppRouteModule = {
  path: '/search',
  name: 'Search',
  component: LAYOUT,
  redirect: '/search/video',
  meta: {
    hideChildrenInMenu: false,
    icon: 'ant-design:calendar-outlined',
    title: '本地检索',
    orderNo: 4,
  },
  children: [
    {
      path: 'video',
      name: 'VideoPage',
      component: () => import('/@/views/videoSearch/index.vue'),
      meta: {
        title: '视频检索',
      },
    },
    {
      path: 'audio',
      name: 'AudioPage',
      component: () => import('/@/views/audioSearch/index.vue'),
      meta: {
        title: '音频检索',
      },
    },
    {
      path: 'ai',
      name: 'aiPage',
      component: () => import('/@/views/aiSearch/index.vue'),
      meta: {
        title: 'ai识别检索',
      },
    },
  ],
};

export default search;
