<template>
  <div>
    <div class="bg-gray-100 p-15px">
      <span>注意</span>
      <div class="mt-5px">当通过搜索方式无法获取设备列表时，可通过手动添加的方式来添加通道。</div>
    </div>
    <div class="px-300px mt-80px">
      <BasicForm @register="registerForm" />
      <div class="flex justify-center">
        <div>
          <Button>取消</Button>
          <Button type="primary" class="ml-10px">添加</Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  // components
  import { useForm, BasicForm } from '/@/components/Form';
  import { Button } from 'ant-design-vue';
  // configs
  import { manualAddFormSchema } from '../config';

  const [registerForm, { validate, setFieldsValue }] = useForm({
    schemas: manualAddFormSchema,
    labelWidth: 80,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    colon: true,
  });
</script>
<style lang="less" scoped></style>
