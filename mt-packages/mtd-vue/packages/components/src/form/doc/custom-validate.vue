<template>
  <mtd-form ref="form" :rules="ruleCustom" :model="formCustom">
    <div>
      <mtd-form-item label="用户名" prop="username">
        <mtd-input type="text" v-model="formCustom.username" />
        <span class="demo-mtd-form-helper">只能输入中文</span>
      </mtd-form-item>
      <mtd-form-item
label="密码" prop="password1"
        helper="6-16个字符，请使用字母加数字的组合密码，不能包含*@#等符号">
        <mtd-input type="text" v-model="formCustom.password1" />
      </mtd-form-item>
      <mtd-form-item
label="确认密码" prop="password2"
        helper="6-16个字符，请使用字母加数字的组合密码，不能包含*@#等符号">
        <mtd-input type="text" v-model="formCustom.password2" />
      </mtd-form-item>
    </div>
    <div>
      <mtd-form-item>
        <mtd-button
type="primary" style="margin-right: 12px;"
          @click="handleSubmit('formCustom')">
          立即创建
        </mtd-button>
        <mtd-button @click="handleReset('formCustom')">取消</mtd-button>
      </mtd-form-item>
    </div>
  </mtd-form>
</template>

<script>
export default {
  data () {
    const checkUsername = (rule, value, callback) => {
      if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
        callback(new Error('只能输入中文'))
      } else {
        callback()
      }
    }
    const checkPassword = (rule, value, callback) => {
      if (!/^[a-zA-Z0-9]{6,16}$/.test(value)) {
        callback(new Error('只能输入6-16个字符且仅为字母,数字'))
      } else {
        if (this.formCustom.password2 !== '') {
          this.$refs.form.validateField('password2')
        }
        callback()
      }
    }
    const checkPasswordEql = (rule, value, callback) => {
      if (this.formCustom.password1 === value) {
        return callback()
      }
      return callback(new Error('两次输入密码不一致!'))
    }

    return {
      formCustom: {
        username: '',
        password1: '',
        password2: '',
      },
      ruleCustom:
        {
          username: [
            { required: true, message: '请输入用户名' },
            { validator: checkUsername },
          ],
          password1: [
            { required: true, message: '请输入密码' },
            { validator: checkPassword },
          ],
          password2: [
            { required: true, message: '请再次输入密码' },
            { validator: checkPasswordEql },
          ],
        },
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$mtd.message('创建成功')
        } else {
          this.$mtd.message({
            type: 'error',
            message: '创建失败',
          })
        }
      })
    },
    handleReset (name) {
      this.$refs.form.resetFields()
    },
  },
}
</script>
