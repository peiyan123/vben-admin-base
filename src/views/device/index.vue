<template>
  <PageWrapper :content-style="{ backgroundColor: '#fff', padding: '30px' }">
    <Breadcrumb>
      <BreadcrumbItem
        v-for="(item, index) in titleRoutes"
        @click="handleRoute(item)"
        :key="index"
        >{{ item.breadcrumbName }}</BreadcrumbItem
      >
    </Breadcrumb>
    <Divider />
    <Tabs v-if="!pageType" v-model:active-key="tabKey" :destroy-inactive-tab-pane="true">
      <TabPane tab="视频设备" key="video"><VideoTable @pageChange="handlePageChange" /></TabPane>
      <TabPane tab="音频设备" key="audio"><AudioTable @pageChange="handlePageChange" /></TabPane>
    </Tabs>
    <AddChannel v-if="pageType === 'add'" :type="tabKey" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, watch } from 'vue';
  // components
  import { PageWrapper } from '/@/components/Page';
  import { Breadcrumb, BreadcrumbItem, Tabs, TabPane, Divider } from 'ant-design-vue';
  import VideoTable from './components/VideoTable.vue';
  import AudioTable from './components/AudioTable.vue';
  import AddChannel from './components/AddChannel.vue';
  // model
  import { Route } from './model';

  const titleRoutes = ref<Route[]>([
    {
      path: '/device',
      key: 0,
      breadcrumbName: '设备管理',
    },
    {
      path: '',
      key: 1,
      breadcrumbName: '视频设备',
    },
  ]);
  const tabKey = ref();
  const pageType = ref(''); // add

  watch(
    () => tabKey.value,
    (newVal) => {
      titleRoutes.value[1].breadcrumbName = newVal === 'video' ? '视频设备' : '音频设备';
    },
  );
  function handlePageChange(data: { page: string; type: string }) {
    pageType.value = data.page;
    titleRoutes.value[2] = { path: '', key: 2, breadcrumbName: '添加通道' };
  }

  function handleRoute(route: Route) {
    if (route.key === 1) {
      pageType.value = '';
      titleRoutes.value.splice(2, 1);
    }
  }
</script>
<style lang="less" scoped></style>
