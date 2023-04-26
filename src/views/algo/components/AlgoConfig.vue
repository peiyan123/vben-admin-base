<template>
  <div>
    <Row class="mb-10px">
      <Col :span="layout.left">最大目标尺寸</Col>
      <Col :span="layout.right">
        <InputNumber
          v-model:value="controlConfig.maxDet"
          :precision="0"
          :min="0"
          :max="1000"
          class="input-number"
        />
      </Col>
    </Row>
    <Row class="mb-10px">
      <Col :span="layout.left">最小目标尺寸</Col>
      <Col :span="layout.right">
        <InputNumber
          v-model:value="controlConfig.minDet"
          :precision="0"
          :min="0"
          :max="1000"
          class="input-number"
        />
      </Col>
    </Row>
    <Row class="mb-10px">
      <Col :span="layout.left">置信度阈值</Col>
      <Col :span="layout.right">
        <InputNumber
          v-model:value="controlConfig.thresh"
          :precision="0"
          :min="0"
          :max="1000"
          class="input-number"
        />
      </Col>
    </Row>
    <Row class="mb-10px">
      <Col :span="layout.left">确认告警帧数</Col>
      <Col :span="layout.right">
        <InputNumber
          v-model:value="controlConfig.minAlarmFrames"
          :precision="0"
          :min="0"
          :max="1000"
          class="input-number"
        />
      </Col>
    </Row>
    <Row class="mb-10px">
      <Col :span="layout.left">告警输出模式</Col>
      <Col :span="layout.right">
        <Select class="w-full" v-model:value="controlConfig.outputMode">
          <Select.Option value="fast">逐帧</Select.Option>
          <Select.Option value="trigger">间隔</Select.Option>
        </Select>
      </Col>
    </Row>
    <Row>
      <Col :span="layout.left">告警间隔</Col>
      <Col :span="layout.right">
        <InputNumber
          v-model:value="controlConfig.timeThresh"
          :precision="0"
          :min="0"
          :max="1000"
          class="input-number"
        />
      </Col>
    </Row>
  </div>
</template>
<script lang="ts" setup>
  // components
  import { Row, Col, Select, InputNumber } from 'ant-design-vue';
  import { useTrain, resetSubmitData } from '../useTrain';

  const { controlConfig } = useTrain();
  const layout = { left: 7, right: 14 };
</script>
<style lang="less" scoped>
  .input-number {
    min-width: unset;
    width: 100%;
  }
</style>
