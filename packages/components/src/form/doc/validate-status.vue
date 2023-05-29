<template>
  <mtd-form :rules="ruleCustom" :model="formCustom">

    <mtd-form-item 
      label="用户名" 
      prop="username" 
      helper="请输入中文"
      :validate-status="formStatus.username"
      :validate-message="formMsg.username"
      hasFeedback>
      <mtd-input type="text" v-model="formCustom.username" style="width: 260px;" />
    </mtd-form-item>

    <mtd-form-item 
      label="密码"
      prop="password"
      error="不建议使用123456这个简单的密码"
      :validate-status="formStatus.password"
      :validate-message="formMsg.password"
      hasFeedback
      helper="6-16个字符，请使用字母加数字的组合密码，不能包含*@#等符号">
      <mtd-input type="password" v-model="formCustom.password" style="width: 260px;"/>
    </mtd-form-item>

    <mtd-form-item 
      label="标签"
      prop="tags"
      :validate-status="formStatus.tags"
      :validate-message="formMsg.tags"
      hasFeedback
     >
      <mtd-select v-model="formCustom.tags" placeholder="请选择" multiple
        style="width: 260px;">
        <mtd-option
          v-for="item in taglist"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </mtd-select>
    </mtd-form-item>
  </mtd-form>
</template>

<script>
export default {
  data () {
    const validateUsername = (rule, value, callback) => {
      this.formStatus.username = 'validating'
      this.formMsg.username = ''
      setTimeout(() => {
        if(!value){
          this.formStatus.username = 'error'
          this.formMsg.username = '用户名不能为空'
          callback(new Error());
        }else if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
          this.formStatus.username = 'error'
          this.formMsg.username = '只能输入中文'
          callback(new Error());
        } else {
          this.formStatus.username = 'success'
          this.formMsg.username = '恭喜您，可以使用这个用户名！'
          callback();
        }
      }, 1000);
    };
    const validatePassword = (rule, value, callback) => {
      this.formStatus.password = 'validating'
      this.formMsg.password = ''
      if (!/^[a-zA-Z0-9]{6,16}$/.test(value)) {
        this.formStatus.password = 'error'
        this.formMsg.password = '只能输入6-16个字符且仅为字母,数字'
        callback(new Error());
      } else if(value === '123456'){
        this.formStatus.password = 'warning'
        this.formMsg.password = '最好不要使用123456作为密码'
        callback();
      } else {
        this.formStatus.password = ''
        callback();
      }
    };
    const validateTags = (rule, value, callback) => {
      this.formStatus.tags = 'validating'
      this.formMsg.tags = ''
      if ( value.length === 1 ) {
        this.formStatus.tags = 'warning'
        this.formMsg.tags = '只选择一个标签可能会导致信息不全面'
        callback();
      } else if( value.length === 0 ) {
        this.formStatus.tags = 'error'
        this.formMsg.tags = '请选择标签'
        callback();
      } else {
        this.formStatus.tags = ''
        this.formMsg.tags = ''
        callback();
      }
    };
    return {
      formCustom: {
        username: '',
        password: '',
        tags: [],
      },
      formStatus:{
        username: '',
        password: '',
        tags: ''
      },
      formMsg:{
        username: '',
        password: '',
        tags: ''
      },
      ruleCustom:
        {
          username: [
            {validator: validateUsername, trigger: 'change'},
          ],
          password: [
            {validator: validatePassword, trigger: 'change'},
          ],
          tags: [
            {validator: validateTags, trigger: 'change'},
          ],
        },
      taglist: [{
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
      }]
    };
  },
};
</script>
