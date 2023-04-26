<template>
  <PageWrapper :content-style="{ backgroundColor: '#fff', padding: '30px' }">
    <Breadcrumb :routes="titleRoutes" />
    <Divider />
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
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  // components
  import { PageWrapper } from '/@/components/Page';
  import { Breadcrumb, Divider } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  // model
  import { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';
  import { columns, searchFormSchema, tableData } from './config';

  const titleRoutes = ref<Route[]>([
    {
      path: '/search',
      breadcrumbName: '本地检索',
    },
    {
      path: '',
      breadcrumbName: '音频检索',
    },
  ]);
  const [registerTable] = useTable({
    // api: undefined,
    dataSource: tableData,
    showIndexColumn: true,
    columns,
    clearSelectOnPageChange: true,
    canResize: false,
    rowKey: 'id',
    useSearchForm: true,
    formConfig: {
      schemas: searchFormSchema,
      labelWidth: 80,
      autoSetPlaceHolder: true,
      submitButtonOptions: { text: '检索' },
      actionColOptions: {
        span: 6,
      },
    },
    actionColumn: {
      width: 250,
      title: '操作',
      dataIndex: 'action',
      fixed: undefined,
    },
  });

  function handleListen() {}
  function handleDel() {}
</script>
<style lang="less" scoped></style>
