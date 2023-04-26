<template>
  <div>
    <div class="flex items-center justify-between my-5px p-5px">
      <div class="flex items-center">
        <span class="font-blod mr-10px">AI识别</span>
        <Switch v-model:checked="aiSwitch" checked-children="开" un-checked-children="关" />
      </div>
      <RadioGroup v-model:value="aiTypeSwitch">
        <RadioButton value="text">文字识别</RadioButton>
        <RadioButton value="voice">语音识别</RadioButton>
      </RadioGroup>
    </div>
    <div
      v-if="aiTypeSwitch === 'text'"
      class="flex p-15px justify-between bg-gray-100 max-h-250px overflow-y-auto"
    >
      <div>
        <p class="font-blod">屏幕1</p>
        <p><span>通道号：</span><span>XXXX</span></p>
        <p><span>通道名称：</span><span>XXXX</span></p>
        <p><span>纬度：</span><span>XXXX</span></p>
        <p><span>经度：</span><span>XXXX</span></p>
        <p><span>目标方位：</span><span>XXXX</span></p>
      </div>
      <div>
        <p class="font-blod">屏幕2</p>
        <p><span>通道号：</span><span>XXXX</span></p>
        <p><span>通道名称：</span><span>XXXX</span></p>
        <p><span>纬度：</span><span>XXXX</span></p>
        <p><span>经度：</span><span>XXXX</span></p>
        <p><span>目标方位：</span><span>XXXX</span></p>
      </div>
      <div>
        <p class="font-blod">屏幕3</p>
        <p><span>通道号：</span><span>XXXX</span></p>
        <p><span>通道名称：</span><span>XXXX</span></p>
        <p><span>纬度：</span><span>XXXX</span></p>
        <p><span>经度：</span><span>XXXX</span></p>
        <p><span>目标方位：</span><span>XXXX</span></p>
      </div>
      <div>
        <p class="font-blod">屏幕4</p>
        <p><span>通道号：</span><span>XXXX</span></p>
        <p><span>通道名称：</span><span>XXXX</span></p>
        <p><span>纬度：</span><span>XXXX</span></p>
        <p><span>经度：</span><span>XXXX</span></p>
        <p><span>目标方位：</span><span>XXXX</span></p>
      </div>
    </div>
    <div v-else class="p-15px justify-between bg-gray-100 max-h-250px overflow-y-auto">
      <p>音频通道1：您好，这里是音频通道1号。音频通道2号，收到请回答，请回答。</p>
      <p>音频通道1：您好，这里是音频通道1号。音频通道2号，收到请回答，请回答。</p>
      <p>音频通道1：您好，这里是音频通道1号。音频通道2号，收到请回答，请回答。</p>
      <p>音频通道1：您好，这里是音频通道1号。音频通道2号，收到请回答，请回答。</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  // components
  import { Switch, RadioGroup, RadioButton } from 'ant-design-vue';
  const aiSwitch = ref(false);
  const aiTypeSwitch = ref('text'); // text,voice
</script>
<style lang="less" scoped></style>
