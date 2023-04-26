<template>
  <div>
    <span>音频通道</span>
    <div class="flex justify-between mt-10px">
      <Input class="w-300px" placeholder="请输入通道号或通道名称" @change="handleSearch">
        <template #suffix>
          <SearchOutlined />
        </template>
      </Input>
      <div>
        <span class="mr-10px">已加/上限设备：4/4</span>
        <PopConfirmButton title="是否确认删除？" type="primary" @confirm="handleBatchDel"
          >删除通道</PopConfirmButton
        >
        <Button class="ml-5px" type="primary" @click="handleAdd">添加通道</Button>
      </div>
    </div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ record, column }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '试听',
                onClick: handleListen.bind(null, record),
              },
              {
                label: '算法配置',
                onClick: handleAlgoConfig.bind(null, record),
              },
              {
                label: '视频配置',
                onClick: handleVideoConfig.bind(null, record),
              },
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                popConfirm: {
                  title: '是否确认删除?',
                  confirm: handleDel.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  // components
  import { columns, tableData } from '../config';
  import { Input, Button } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import PopConfirmButton from '/@/components/Button/src/PopConfirmButton.vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import { useRouter } from 'vue-router';
  import { debounce } from 'lodash-es';

  const emits = defineEmits(['pageChange']);
  const router = useRouter();
  const selectKeys = ref<string[]>([]);
  const [registerTable] = useTable({
    // api: undefined,
    dataSource: tableData,
    showIndexColumn: false,
    columns,
    clearSelectOnPageChange: true,
    canResize: false,
    rowKey: 'id',
    rowSelection: {
      onChange: (keys: any) => {
        console.log(keys);
        selectKeys.value = keys;
      },
    },
    actionColumn: {
      width: 350,
      title: '操作',
      dataIndex: 'action',
      fixed: undefined,
    },
  });

  function handleListen() {}
  function handleAlgoConfig() {
    router.push({ name: 'Algo', query: { type: 'voice' } });
  }
  function handleVideoConfig() {}
  function handleEdit() {}
  function handleDel() {}
  function handleBatchDel() {
    if (!selectKeys.value.length) {
      createMessage.info('请勾选通道');
    }
    return true;
  }
  function handleAdd() {
    emits('pageChange', { page: 'add', type: 'audio' });
  }
  const handleSearch = debounce((e) => {
    console.log(e.target.value);
  }, 500);
</script>
<style lang="less" scoped></style>
