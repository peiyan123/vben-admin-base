<template>
  <Tabs>
    <TabPane tab="搜索添加" key="search"><SearchAdd /></TabPane>
    <TabPane v-if="type === 'video'" tab="手动添加" key="manual"><ManualAdd /></TabPane>
  </Tabs>
</template>
<script lang="ts" setup>
  // components
  import { Tabs, TabPane } from 'ant-design-vue';
  import SearchAdd from './SearchAdd.vue';
  import ManualAdd from './ManualAdd.vue';

  defineProps({
    type: String,
  });
</script>
<style lang="less" scoped></style>
