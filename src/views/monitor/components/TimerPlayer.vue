<template>
  <div id="timeSlider"></div>
  <div class="flex justify-center border border-gray-400 relative">
    <div class="flex items-center">
      <fast-backward-outlined class="text-size-30px cursor-pointer" @click="handleLeft" />
      <caret-right-outlined class="text-size-30px" v-if="!isPlay" @click="handlePlay" />
      <pause-outlined class="text-size-30px" v-if="isPlay" @click="handlePlay" />
      <fast-forward-outlined class="text-size-30px cursor-pointer" @click="handleRight" />
    </div>
    <div class="absolute right-10px top-3px">
      <Tag color="pink" class="ss-ant-tag" />定时 <Tag color="red" class="ss-ant-tag" />报警</div
    >
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import {
    FastBackwardOutlined,
    CaretRightOutlined,
    PauseOutlined,
    FastForwardOutlined,
  } from '@ant-design/icons-vue';
  import { Tag } from 'ant-design-vue';
  // utils
  import timeSlider from '/@/timerSlider/components/timeSlider.js';

  const isPlay = ref(false);
  let timeSliderInstance;
  function initTimerSlider() {
    timeSliderInstance = new timeSlider('#timeSlider', {
      curDaytimeChunkArray: [
        // '012200-023000-C',
        // '002200-003000-B',
        // '001200-002000-A',
        '000000-200000-A',
      ],
      presentSeconds: 0,
      timeChunkType: {
        A: 'green',
        B: 'yellow',
        C: 'blue',
      },
      speed: 1,
      isInitialPlay: false,
      hander: (time) => {
        console.log('time', time); // time 当前点击合理时间段的时间
        if (isPlay.value) {
          timeSliderInstance.timeLinePlay();
        }
      },
    });
  }

  function handlePlay() {
    isPlay.value = !isPlay.value;
    if (isPlay.value) {
      timeSliderInstance.timeLinePlay();
    } else {
      timeSliderInstance.timeLineStop();
    }
  }

  function handleLeft() {
    timeSliderInstance.presentSeconds = timeSliderInstance.presentSeconds - 10;
  }
  function handleRight() {
    timeSliderInstance.presentSeconds = timeSliderInstance.presentSeconds + 10;
  }

  onMounted(() => {
    initTimerSlider();
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ss-ant-tag) {
    &.ant-tag {
      height: 10px;
      padding: 0 4px;
    }
  }
</style>
<style>
  @import url('/@/timerSlider/statics/css/index.css');
  #timeSlider {
    padding-top: 40px;
    padding-bottom: 15px;
  }
</style>
