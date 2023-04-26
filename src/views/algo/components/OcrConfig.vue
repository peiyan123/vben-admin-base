<template>
  <div>
    <div class="mb-20px">
      <Row align="middle" :gutter="20" class="my-20px">
        <Col>通道号:</Col>
        <Col
          ><Select
            class="w-200px"
            v-model:value="channelModelVal"
            placeholder="请选择视频通道号"
            :options="channelList"
            @change="handleChangeChaneel"
        /></Col>
      </Row>
      <Row align="middle" :gutter="20">
        <Col>算法开启:</Col>
        <Col
          ><Switch v-model:checked="isAlgoOpen" checked-children="开" un-checked-children="关"
        /></Col>
      </Row>
    </div>
    <div class="bg-gray-100 p-20px">
      <div class="flex items-center mb-10px">
        <Button v-if="!isDrawing" class="mr-15px" ghost type="primary" @click="handleDrawPolygon"
          >分析区域绘制</Button
        >
        <Button class="mr-15px" type="primary" v-if="isDrawing" @click="clearDraw">清除</Button>
        <Button class="mr-15px" type="primary" v-if="isDrawing" @click="saveDraw">保存</Button>
        <span>支持多边形区域绘制，默认分析全图区域。</span>
      </div>
      <div class="flex items-center">
        <div style="width: 50%" class="mr-50px bg-dark-500">
          <AreaRule :url="url" />
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
  import { ref, watch } from 'vue';
  // components
  import { Row, Col, Select, Switch, Button } from 'ant-design-vue';
  import AlgoConfig from './AlgoConfig.vue';
  import AreaRule from './AreaRule.vue';
  import { useTrainContext } from '../useContext';

  const channelList = ref([
    {
      value:
        'https://10.0.75.69:8888/stream0/21f74000-01e0-11b4-8268-5850ed794c42.live.flv?vhost=__defaultVhost__',
      label: '11',
    },
    { value: 'https://10.0.75.69:8888/gb28181/rtp/1200000020.live.flv', label: '22' },
  ]);
  const isAlgoOpen = ref(false);
  const isDrawing = ref();
  const { drawEmitter } = useTrainContext();
  const channelModelVal = ref();
  const url = ref('');

  function handleChangeChaneel() {
    url.value = channelModelVal.value;
  }
  function handleDrawPolygon() {
    isDrawing.value = 'polygon';
    drawEmitter.emit('polygon', 'draw');
  }
  function clearDraw() {
    drawEmitter.emit(isDrawing.value, 'clear');
    isDrawing.value = '';
  }
  function saveDraw() {
    drawEmitter.emit(isDrawing.value, 'save');
    isDrawing.value = '';
  }
</script>

<style lang="less" scoped></style>
