<template>
  <mtd-form :rules="ruleCustom" :model="formCustom">
    <mtd-form-item label="用户名" prop="username1">
      <mtd-input type="text" v-model="formCustom.username1" />
      <span class="demo-mtd-form-helper">只能输入中文</span>
    </mtd-form-item>
    <mtd-form-item label="密码" prop="password1"
      helper="6-16个字符，请使用字母加数字的组合密码，不能包含*@#等符号">
      <mtd-input type="text" v-model="formCustom.password1" />
    </mtd-form-item>
  </mtd-form>
</template>

<script>
export default {
  data () {
    const validateUsernameSync = (rule, value, callback) => {
      setTimeout(() => {
        if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
          callback(new Error('只能输入中文'));
        } else {
          callback();
        }
      }, 2000);
    };
    const validatePasswordSync = (rule, value, callback) => {
      setTimeout(() => {
        if (!/^[a-zA-Z0-9]{6,16}$/.test(value)) {
          callback(new Error('只能输入6-16个字符且仅为字母,数字'));
        } else {
          callback();
        }
      }, 2000);
    };
    return {
      formCustom: {
        username1: '',
        password1: '',
      },
      ruleCustom:
        {
          username1: [
            {validator: validateUsernameSync, trigger: 'change'},
          ],
          password1: [
            {validator: validatePasswordSync, trigger: 'change'},
          ],
        },
    };
  },
};
</script>
