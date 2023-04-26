<template>
  <div class="relative h-full">
    <div ref="videoRef"></div>
    <div class="no-sign" v-show="isNoSign">无信号</div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, unref, watch, defineProps, onMounted, onUnmounted } from 'vue';
  import JessibucaType from '/#/jessibuca';

  const props = defineProps({
    url: {
      type: String,
      default: '',
    },
    activeKey: {
      type: Number,
      default: 0,
    },
    keySelf: {
      type: Number,
    },
  });
  const videoRef = ref();
  const instance = ref<JessibucaType>();
  const isNoSign = ref(true);

  watch([() => props.url, () => props.activeKey], ([newUrl, newActiveKey]) => {
    console.log(newUrl, newActiveKey);
    if (newUrl && props.keySelf === newActiveKey) {
      reload(newUrl);
    }
  });
  function reload(url) {
    console.log(unref(instance));
    if (unref(instance)) {
      unref(instance)?.destroy();
      isNoSign.value = true;
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
        fullscreen: true,
        screenshot: true,
        play: true,
        audio: true,
        record: true,
      },
      forceNoOffscreen: false,
      isNotMute: false,
    });
    unref(instance)?.play(url);
    isNoSign.value = false;
    unref(instance)?.on('play', () => {
      console.log('play');
    });
  }

  onMounted(() => {
    if (props.url && props.keySelf === props.activeKey) {
      reload(props.url);
    }
  });

  onUnmounted(() => {
    if (unref(instance)) {
      unref(instance)?.destroy();
    }
  });
  defineExpose({
    reload,
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
