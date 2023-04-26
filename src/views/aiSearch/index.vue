<template>
  <PageWrapper :content-style="{ backgroundColor: '#fff', padding: '30px' }">
    <Breadcrumb :routes="titleRoutes" />
    <Divider />
    <Tabs :destroy-inactive-tab-pane="true">
      <TabPane tab="文字识别" key="text"> <TextTable /> </TabPane>
      <TabPane tab="语音识别" key="voice"><VoiceTable /></TabPane>
    </Tabs>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  // components
  import { PageWrapper } from '/@/components/Page';
  import TextTable from './components/TextTable.vue';
  import VoiceTable from './components/VoiceTable.vue';
  import { Breadcrumb, Tabs, TabPane, Divider } from 'ant-design-vue';
  // models
  import { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';

  const titleRoutes = ref<Route[]>([
    {
      path: '',
      breadcrumbName: '本地检索',
    },
    {
      path: '',
      breadcrumbName: 'AI识别检索',
    },
  ]);
</script>
<style lang="less" scoped></style>
