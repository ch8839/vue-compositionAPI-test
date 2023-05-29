<template>
  <mtd-form :model="dynamicValidateForm" ref="dynamicValidateForm"
    :label-width="100" class="demo-dynamic">
    <mtd-form-item
      prop="email"
      label="邮箱"
      :rules="[
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
      ]">
      <mtd-input v-model="dynamicValidateForm.email" />
    </mtd-form-item>
    <mtd-form-item
      v-for="(domain, index) in dynamicValidateForm.domains"
      :label="'域名' + index"
      :key="domain.key"
      :prop="'domains.' + index + '.value'"
      :rules="{
        required: true, message: '域名不能为空', trigger: 'blur'
      }">
      <mtd-input v-model="domain.value" />
      <mtd-icon-button icon="delete-o" style="margin-left: 8px;color: rgba(0,0,0,0.9)" @click.prevent="removeDomain(domain)" />
    </mtd-form-item>
    <mtd-form-item>
      <!-- <mtd-button type="primary" @click="submitForm('dynamicValidateForm')" style="margin-right: 20px">提交</mtd-button> -->
      <mtd-button @click="addDomain"> + 新增域名</mtd-button>
      <!-- <mtd-button @click="resetForm('dynamicValidateForm')">重置</mtd-button> -->
    </mtd-form-item>
  </mtd-form>
</template>
<script>
export default {
  data () {
    return {
      dynamicValidateForm: {
        domains: [{
          value: '',
        }],
        email: '',
      },
    };
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain (item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain () {
      this.dynamicValidateForm.domains.push({
        value: '',
        key: Date.now(),
      });
    },
  },
};
</script>
