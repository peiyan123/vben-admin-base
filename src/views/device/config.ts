import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Form';

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
    title: '设备类型',
  },
  {
    dataIndex: 'd',
    title: '状态',
  },
];

export const searchColumns: BasicColumn[] = [
  {
    dataIndex: 'a',
    title: '序号',
  },
  {
    dataIndex: 'b',
    title: '设备型号',
  },
  {
    dataIndex: 'c',
    title: '通道名称',
  },
  {
    dataIndex: 'd',
    title: '设备类型',
  },
];

export const manualAddFormSchema: FormSchema[] = [
  {
    field: 'a',
    label: '通道名称',
    component: 'Input',
    required: true,
    itemProps: {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    },
  },
  {
    field: 'b',
    label: 'RTSP地址',
    component: 'Input',
    itemProps: {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    },
  },
];
