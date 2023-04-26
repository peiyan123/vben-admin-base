import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const algo: AppRouteModule = {
  path: '/algo',
  name: 'Algo',
  component: LAYOUT,
  redirect: '/algo/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ant-design:check-circle-outlined',
    title: '算法配置',
    orderNo: 5,
  },
  children: [
    {
      path: 'index',
      name: 'AlgoPage',
      component: () => import('/@/views/algo/index.vue'),
      meta: {
        title: '算法配置',
      },
    },
  ],
};

export default algo;
