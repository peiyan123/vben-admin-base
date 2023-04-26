<template>
  <div>
    <div class="bg-gray-100 p-15px">
      <span>注意</span>
      <div class="mt-5px"
        >点击“开始搜索”可自动扫描出通过HDMI接口已连接的视频设备，选中对应设备并添加，即可完成视频通道的添加。</div
      >
    </div>
    <div class="my-10px flex justify-between">
      <div>
        <Button>取消</Button>
        <Button class="ml-10px" type="primary">添加</Button>
      </div>
      <Button type="primary">开始搜索</Button>
    </div>
    <BasicTable @register="registerTable" />
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  // components
  import { useTable, BasicTable } from '/@/components/Table';
  import { searchColumns, tableData } from '../config';
  import { Button } from 'ant-design-vue';

  const selectKeys = ref<string[]>([]);
  const [registerTable] = useTable({
    // api: undefined,
    dataSource: tableData,
    columns: searchColumns,
    clearSelectOnPageChange: true,
    canResize: false,
    rowKey: 'id',
    showIndexColumn: false,
    rowSelection: {
      onChange: (keys: any) => {
        console.log(keys);
        selectKeys.value = keys;
      },
    },
  });
</script>
<style lang="less" scoped></style>
