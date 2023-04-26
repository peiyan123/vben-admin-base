<template>
  <div class="relative h-full">
    <div ref="videoRef"></div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, unref, watch, defineProps, onMounted, onUnmounted } from 'vue';

  const props = defineProps({
    url: {
      type: String,
      default: '',
    },
  });
  const videoRef = ref();
  const instance = ref();

  watch(
    () => props.url,
    (newUrl) => {
      if (newUrl) {
        initLoad(newUrl);
      }
    },
  );
  function initLoad(url) {
    console.log(unref(instance));
    if (unref(instance)) {
      unref(instance).destroy();
    }
    instance.value = new JessibucaPro({
      container: videoRef.value,
      videoBuffer: 2, // 缓存时长
      videoBufferDelay: 1,
      networkDelay: 10,
      isResize: false,
      text: '',
      loadingText: '加载中',
      debug: true,
      showBandwidth: false, // 显示网速
      decoder: '/resource/js/decoder-pro.js',
      operateBtns: {
        fullscreen: false,
        screenshot: false,
        play: false,
        audio: false,
      },
      forceNoOffscreen: false,
      isNotMute: false,
    });
    unref(instance).play(url);
  }

  onMounted(() => {
    if (props.url) {
      initLoad(props.url);
    }
  });

  onUnmounted(() => {
    if (unref(instance)) {
      unref(instance).destroy();
    }
  });
</script>
<style lang="less" scoped>
  .no-sign {
    position: absolute;
    top: 50%;
    left: 50%;
    color: #fff;
  }
</style>
