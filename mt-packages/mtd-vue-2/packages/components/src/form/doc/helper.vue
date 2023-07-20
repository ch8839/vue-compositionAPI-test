<template>
  <mtd-form>
    <div>
      <p class="demo-form-title">形式一</p>
      <mtd-form-item label="密码" helper="6-16个字符，请使用字母加数字的组合密码，不能包含*@#等符号" helper-placement="right">
        <mtd-input type="password" v-model="password1"/>
      </mtd-form-item>
    </div>
    <div>
      <p class="demo-form-title">形式二</p>
      <mtd-form-item label="密码" helper="6-16个字符，请使用字母加数字的组合密码，不能包含*@#等符号">
        <mtd-input type="password" v-model="password2"/>
      </mtd-form-item>
    </div>
  </mtd-form>
</template>

<script>
export default {
  data () {
    return {
      password1: '',
      password2: '',
    };
  },
};
</script>


