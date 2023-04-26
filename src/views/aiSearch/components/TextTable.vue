<template>
  <BasicTable @register="registerTable">
    <template #bodyCell="{ record, column }">
      <template v-if="column.key === 'action'">
        <TableAction
          :actions="[
            {
              label: '预览',
              onClick: handlePreview.bind(null, record),
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
</template>
<script lang="ts" setup>
  // components
  import { columns, searchFormSchema, tableData } from '../config';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
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
      labelWidth: 120,
      autoSetPlaceHolder: true,
      submitButtonOptions: { text: '检索' },
      actionColOptions: {
        span: 8,
      },
      colon: true,
    },
    actionColumn: {
      width: 250,
      title: '操作',
      dataIndex: 'action',
      fixed: undefined,
    },
  });

  function handlePreview() {}
  function handleDel() {}
</script>
<style lang="less" scoped></style>
