<template>
  <div>
    <div class="mb-20px">
      <Row align="middle" :gutter="20" class="my-20px">
        <Col>通道号:</Col>
        <Col><Select class="w-200px" placeholder="请选择音频通道号" :options="channelList" /></Col>
      </Row>
      <Row align="middle" :gutter="20">
        <Col>算法开启:</Col>
        <Col
          ><Switch v-model:checked="isAlgoOpen" checked-children="开" un-checked-children="关"
        /></Col>
      </Row>
    </div>
    <div class="bg-gray-100 p-20px">
      <div class="flex items-center">
        <div style="width: 50%" class="mr-50px">
          <img :src="audioImg" alt="" />
        </div>
        <div style="width: 35%">
          <AlgoConfig />
        </div>
      </div>
      <Button class="mt-20px" type="primary">保存并应用</Button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  // components
  import { Row, Col, Select, Switch, Button } from 'ant-design-vue';
  import AlgoConfig from './AlgoConfig.vue';
  import audioImg from '/@/assets/images/u1597.png';

  const channelList = ref([
    { value: '11', label: '11' },
    { value: '22', label: '22' },
  ]);
  const isAlgoOpen = ref(false);
</script>

<style lang="less" scoped></style>
