import { BasicColumn, FormSchema } from '/@/components/Table';

export const tableData = [
  { id: 1, a: 'xx', b: 'xx', c: 'xx', d: 'xx' },
  { id: 2, a: 'xx', b: 'xx', c: 'xx', d: 'xx' },
  { id: 3, a: 'xx', b: 'xx', c: 'xx', d: 'xx' },
  { id: 4, a: 'xx', b: 'xx', c: 'xx', d: 'xx' },
  { id: 5, a: 'xx', b: 'xx', c: 'xx', d: 'xx' },
  { id: 6, a: 'xx', b: 'xx', c: 'xx', d: 'xx' },
  { id: 7, a: 'xx', b: 'xx', c: 'xx', d: 'xx' },
  { id: 8, a: 'xx', b: 'xx', c: 'xx', d: 'xx' },
  { id: 9, a: 'xx', b: 'xx', c: 'xx', d: 'xx' },
  { id: 10, a: 'xx', b: 'xx', c: 'xx', d: 'xx' },
  { id: 11, a: 'xx', b: 'xx', c: 'xx', d: 'xx' },
  { id: 12, a: 'xx', b: 'xx', c: 'xx', d: 'xx' },
];

export const columns: BasicColumn[] = [
  {
    dataIndex: 'a',
    title: '通道号',
  },
  {
    dataIndex: 'b',
    title: '通道名称',
  },
  {
    dataIndex: 'c',
    title: '存储日期',
  },
  {
    dataIndex: 'd',
    title: '文件大小',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'c',
    label: '起止日期',
    component: 'RangePicker',
    colProps: {
      span: 6,
    },
    componentProps: {
      style: { width: '100%' },
    },
  },
  {
    field: 'a',
    label: '通道号',
    component: 'Input',
    colProps: {
      span: 6,
    },
  },
  {
    field: 'b',
    label: '通道名称',
    component: 'Input',
    colProps: {
      span: 6,
    },
  },
];
