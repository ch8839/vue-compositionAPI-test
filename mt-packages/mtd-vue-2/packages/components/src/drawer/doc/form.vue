<template>
  <div>
    <mtd-button type="primary" @click="visible = true">打开抽屉</mtd-button>
    <mtd-drawer
      v-model="visible"
      v-model:visible="visible"
      class="demo-drawer-form"
      width="800px"
      destroy-on-close
      :closable="false"
    >
      <template #title>
        <div style="display:flex;align-items:center;justify-content: space-between">
          <div style="display:flex">
            <div class="demo-drawer-close-icon" @click="visible = false">
              <mtd-icon name="close" />
            </div>
            <h3 class="title" style="margin:0 0 0 16px">创建 Offer</h3>
          </div>
          <div class="demo-action">
            <mtd-button type="primary" @click="handleSubmit">提交</mtd-button>
            <mtd-button @click="visible = false">取消</mtd-button>
          </div>
        </div>
      </template>
      <h4 class="sub-title" style="margin-top:4px">原雇主薪酬</h4>
      <mtd-form :rules="rules" :model="model" ref="form">
        <mtd-row>
          <mtd-col :span="12">
            <mtd-form-item label="公司主体:" prop="company">
              <mtd-input v-model="model.company" style="width: 200px" />
            </mtd-form-item>
          </mtd-col>
          <mtd-col :span="12">
            <mtd-form-item label="开户行:" prop="bank">
              <mtd-input v-model="model.bank" style="width: 200px" />
            </mtd-form-item>
          </mtd-col>
        </mtd-row>
        <mtd-row>
          <mtd-col :span="12">
            <mtd-form-item label="岗位类别:" prop="type">
              <mtd-select v-model="model.type" style="width: 200px">
                <mtd-option label="研发岗" value="1" />
                <mtd-option label="产品岗" value="2" />
                <mtd-option label="安全岗" value="3" />
              </mtd-select>
            </mtd-form-item>
          </mtd-col>
          <mtd-col :span="12">
            <mtd-form-item label="基本薪资:" prop="salary">
              <mtd-input v-model="model.salary" style="width: 200px" />
            </mtd-form-item>
          </mtd-col>
        </mtd-row>
        <mtd-row>
          <mtd-col :span="12">
            <mtd-form-item label="入职时间:" prop="hiredate">
              <mtd-date-picker type="date" v-model="model.hiredate" />
            </mtd-form-item>
          </mtd-col>
          <mtd-col :span="12">
            <mtd-form-item label="离职时间:" prop="leavedate">
              <mtd-date-picker type="date" v-model="model.leavedate" />
            </mtd-form-item>
          </mtd-col>
        </mtd-row>
        <mtd-row>
          <mtd-col :span="12">
            <mtd-form-item label="简历来源:" prop="source">
              <mtd-checkbox-group v-model="model.source">
                <mtd-checkbox value="1">官网</mtd-checkbox>
                <mtd-checkbox value="2">伯乐网</mtd-checkbox>
                <mtd-checkbox value="3">猎头网</mtd-checkbox>
              </mtd-checkbox-group>
            </mtd-form-item>
          </mtd-col>
          <mtd-col :span="12">
            <mtd-form-item label="部门名称:" prop="department">
              <mtd-input v-model="model.department" style="width: 200px" />
            </mtd-form-item>
          </mtd-col>
        </mtd-row>
      </mtd-form>
    </mtd-drawer>
  </div>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
      model: {
        company: '',
        bank: '',
        type: '',
        salary: '',
        hiredate: '',
        leavedate: '',
        source: [],
        department: '',
        remarks: '',
      },
      submitting: false,
      rules: {
        company: { required: true, message: '请填写公司主体' },
        bank: { required: true },
        type: { required: true },
        salary: { required: true },
      },
    }
  },
  methods: {
    handleSubmit () {
      this.submitting = true
      this.$refs.form.validate().then(() => {
        this.submitting = false
        this.visible = false
        this.$mtd.message('提交成功')
      })
    },
  },
}
</script>
<style lang="scss">
.demo-drawer-form {
  ::v-deep {
    .mtd-drawer-close {
      left: 16px;
      right: auto;
    }
    .mtd-input-wrapper,
    .mtd-select {
      width: 100%;
    }
    .mtd-date-picker {
      width: 100%;
    }
  }
}

.demo-drawer-close-icon {
  height: 28px;
  width: 28px;

  cursor: pointer;

  border-radius: 50%;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(0,0,0,0.04);
  }

  &:active {
    background-color: rgba(0,0,0,0.06);
  }
}

.demo-action {
  text-align: right;
  > button {
    min-width: 80px;
  }
  button + button {
    margin-left: 12px;
  }
}
.demo-remarks {
  width: 100%;
  height: 300px;
}
.title {
  margin: 16px 0;
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;
}
.sub-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  line-height: 24px5;
}
</style>
