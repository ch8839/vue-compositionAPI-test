<template>
  <mtd-form :model="formCustom" ref="formCustom" :rules="ruleCustom">
    <mtd-form-item label="主机名称" prop="hostname"
      use-html-message>
      <mtd-input type="text" v-model="formCustom.hostname" style="width: 260px;" />
    </mtd-form-item>
    <mtd-form-item label="管理员" prop="owner">
      {{ formCustom.owner }}
    </mtd-form-item>
    <mtd-form-item>
      <mtd-button type="primary" style="margin-right: 12px;"
        @click="handleSubmit('formCustom')">
        立即创建
      </mtd-button>
      <mtd-button @click="handleReset('formCustom')">取消</mtd-button>
    </mtd-form-item>
  </mtd-form>
</template>
<script>
export default {
  data () {
    const validateHostname = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('<p style="background-color: #fff9e6;padding: 0 4px;color: #592d00;">主机名称必须大于 3 个字</p>'));
      } else {
        callback();
      }
    };
    return {
      formCustom: {
        hostname: '',
        owner: '李明/liming',
      },
      ruleCustom: {
        hostname: [
          {
            required: true,
            message: '<p style="background-color: #fff9e6;padding: 0 4px;color: #592d00;">请输入主机名称</p>',
          },
          { validator: validateHostname, trigger: 'blur' },
        ],
      },
      list1: [{
        value: '1',
        label: '区域1',
        children: [{
          value: '1',
          label: '主机1',
        }, {
          value: '2',
          label: '主机2',
        }],
      }, {
        value: '2',
        label: '区域2',
        children: [{
          value: '3',
          label: '主机3',
        }, {
          value: '4',
          label: '主机4',
        }],
      }],
      list2: [{
        value: 'tag1',
        label: '标签1',
      }, {
        value: 'tag2',
        label: '标签2',
      }, {
        value: 'tag3',
        label: '标签3',
      }, {
        value: 'tag4',
        label: '标签4',
      }, {
        value: 'tag5',
        label: '标签5',
      }],
    };
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          console.log('Success!');
        } else {
          console.error('Fail!');
        }
      });
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    },
  },
};
</script>
<style lang='scss'>
  .demo-input-group{
    >:not(:last-child){
      .mtd-input {
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
        border-right: none;
      }
    }
    >:not(:first-child){
      .mtd-input {
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
      }
    }
  }
</style>
