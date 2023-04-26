<template>
  <PageWrapper :content-style="{ backgroundColor: '#fff', padding: '30px' }">
    <Breadcrumb :routes="titleRoutes" />
    <Divider />
    <div class="flex">
      <div style="width: 20%; margin-right: 2%">
        <div class="mb-15px" v-if="isPlayback">
          <p class="font-bold">选择日期</p>
          <DatePicker class="w-full" @change="handleDateChange" />
        </div>
        <p class="font-bold">视频通道列表</p>
        <div class="p-10px bg-gray-100 mb-10px">
          <div
            class="flex items-center mb-10px cursor-pointer"
            :class="{ active: currentChannelActive === index }"
            v-for="(item, index) in channelList"
            :key="index"
            @click="handleSelectChannel(item, index)"
          >
            <CameraOutlined />
            <span>【IPC-12】10.0.0.0</span>
          </div>
        </div>
        <p class="font-bold">音频通道列表</p>
        <div class="p-10px bg-gray-100 mb-10px">
          <div class="mb-10px">
            <div class="flex items-center">
              <sound-outlined />
              <span>【通道号】音频通道名1</span>
            </div>
            <div class="flex items-center w-full">
              <Slider class="ss-silder" v-model:value="volume1" />
              <span>{{ volume1 }}</span>
            </div>
          </div>
          <div class="mb-10px">
            <div class="flex items-center">
              <sound-outlined />
              <span>【通道号】音频通道名2</span>
            </div>
            <div class="flex items-center w-full">
              <Slider class="ss-silder" v-model:value="volume2" />
              <span>{{ volume2 }}</span>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 78%">
        <div class="flex flex-wrap">
          <div
            class="video-box"
            :class="{ active: currentVideoActive === item.key }"
            v-for="item in videoArr"
            :key="item.key"
            @click="handleSelectVideo(item)"
          >
            <Video :key-self="item.key" :activeKey="currentVideoActive" :url="url" />
          </div>
        </div>
        <div style="padding-right: 0.8%" v-if="isPlayback">
          <TimerPlayer />
        </div>
        <AiRecognize
      /></div>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onUnmounted, ref } from 'vue';
  // components
  import { PageWrapper } from '/@/components/Page';
  import AiRecognize from './components/AiRecognize.vue';
  import TimerPlayer from './components/TimerPlayer.vue';
  import Video from './components/Video.vue';
  import { Breadcrumb, Divider, Slider, DatePicker } from 'ant-design-vue';
  import { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';
  import { CameraOutlined, SoundOutlined } from '@ant-design/icons-vue';
  // hooks
  import { useRoute } from 'vue-router';
  import mitt from '/@/utils/mitt';
  import { createPlayerContext } from './useContext';

  const routesMonitor = [
    {
      path: '',
      breadcrumbName: '视频监控',
    },
  ];
  const routesPlayback = [
    {
      path: '',
      breadcrumbName: '本地回放',
    },
  ];
  const route = useRoute();
  const isPlayback = ref(route.name === 'PlaybackPage');
  const titleRoutes = ref<Route[]>(isPlayback.value ? routesPlayback : routesMonitor);
  const playerEmitter = mitt();
  createPlayerContext({ playerEmitter });
  const volume1 = ref(0);
  const volume2 = ref(0);
  const currentChannelActive = ref(0);
  const channelList = ref([
    {
      url: 'https://10.0.75.69:8888/stream0/21f74000-01e0-11b4-8268-5850ed794c42.live.flv?vhost=__defaultVhost__',
    },
    { url: 'https://10.0.75.69:8888/gb28181/rtp/1200000020.live.flv' },
    { url: 'https://10.0.75.69:8888/gb28181/rtp/1200000023.live.flv' },
    {
      url: 'https://10.0.75.69:8888/stream0/3fa1fe68-b915-4053-a3e1-04f9f8e09804.live.flv?vhost=__defaultVhost__',
    },
  ]);
  const url = ref(channelList.value[0].url);
  const currentVideoActive = ref(0);
  const videoArr = ref([
    {
      key: 0,
      ref: ref(),
    },
    {
      key: 1,
      ref: ref(),
    },
    {
      key: 2,
      ref: ref(),
    },
    {
      key: 3,
      ref: ref(),
    },
  ]);
  function handleDateChange(date: dayjs | string, dateString: string) {}

  function handleSelectVideo(item) {
    currentVideoActive.value = item.key;
  }
  function handleSelectChannel(item, index) {
    currentChannelActive.value = index;
    currentVideoActive.value = currentVideoActive.value === 3 ? 0 : currentVideoActive.value + 1;
    url.value = item.url;
  }
  onUnmounted(() => {
    playerEmitter.clear();
  });
</script>
<style lang="less" scoped>
  @import url('index.less');
</style>
