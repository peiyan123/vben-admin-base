<template>
  <PageWrapper :content-style="{ backgroundColor: '#fff', padding: '30px' }">
    <Breadcrumb :routes="titleRoutes" />
    <Divider />
    <Tabs :default-active-key="activeKey">
      <TabPane tab="OCR算法配置" key="ocr"><OcrConfig /> </TabPane>
      <TabPane tab="语音识别配置" key="voice"><VoiceConfig /></TabPane>
    </Tabs>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onUnmounted, ref } from 'vue';
  // components
  import { PageWrapper } from '/@/components/Page';
  import OcrConfig from './components/OcrConfig.vue';
  import VoiceConfig from './components/VoiceConfig.vue';
  import { Breadcrumb, Tabs, TabPane, Divider } from 'ant-design-vue';
  // models
  import { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';
  // hooks
  import { createTrainContext } from './useContext';
  import mitt from '/@/utils/mitt';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  console.log(route.query);
  const activeKey = ref<any>(route.query.type ?? 'ocr');
  const titleRoutes = ref<Route[]>([
    {
      path: '',
      breadcrumbName: '算法配置',
    },
  ]);
  const drawEmitter = mitt();
  createTrainContext({ drawEmitter });

  onUnmounted(() => {
    drawEmitter.clear();
  });
</script>
<style lang="less" scoped></style>
