<template>
  <div>
    <mtd-button type="primary" @click="visible = true">打开抽屉</mtd-button>
    <mtd-drawer
      v-model="visible"
      class="demo-drawer-form"
      width="800px"
      destroy-on-close
    >
      <template #title>
        <h3 class="title">创建 Offer</h3>
        <div class="demo-action">
          <mtd-button type="primary" @click="handleSubmit">提交</mtd-button>
          <mtd-button @click="visible = false">取消</mtd-button>
        </div>
      </template>
      <h4 class="sub-title">原雇主薪酬</h4>
      <mtd-form :rules="rules" :model="model" ref="form" label-width="120">
        <mtd-row>
          <mtd-col :span="12">
            <mtd-form-item label="公司主体:" prop="company">
              <mtd-input v-model="model.company" placeholder="请输入公司主体" />
            </mtd-form-item>
          </mtd-col>
          <mtd-col :span="12">
            <mtd-form-item label="开户行:" prop="openingbank">
              <mtd-input
                v-model="model.openingbank"
                placeholder="请输入开户行"
              />
            </mtd-form-item>
          </mtd-col>
        </mtd-row>
        <mtd-row>
          <mtd-col :span="12">
            <div>
              <mtd-form-item
                label="期望提交审核的日期:"
                prop="submitdata"
                class="formheight1"
              >
                <mtd-select v-model="model.submitdata" placeholder="请选择日期">
                  <mtd-option label="研发岗" value="1" />
                  <mtd-option label="产品岗" value="2" />
                  <mtd-option label="安全岗" value="3" />
                </mtd-select>
              </mtd-form-item>
            </div>
          </mtd-col>
          <mtd-col :span="12">
            <mtd-form-item label="个人银行账号:" prop="bank">
              <mtd-input v-model="model.bank" placeholder="请输入银行账号" />
            </mtd-form-item>
          </mtd-col>
        </mtd-row>
        <mtd-row>
          <mtd-col :span="12">
            <mtd-form-item label="岗位类别:" prop="worktype">
              <mtd-select v-model="model.worktype" placeholder="请选择类别">
                <mtd-option label="研发岗" value="1" />
                <mtd-option label="产品岗" value="2" />
                <mtd-option label="安全岗" value="3" />
              </mtd-select>
            </mtd-form-item>
          </mtd-col>
          <mtd-col :span="12">
            <mtd-form-item label="基本薪资:" prop="salary">
              <mtd-input v-model="model.salary" placeholder="请选择薪资范围" />
            </mtd-form-item>
          </mtd-col>
        </mtd-row>
      </mtd-form>

      <h4 class="sub-title">竞争Offer</h4>
      <mtd-form :rules="rules" :model="model" ref="form" label-width="120">
        <mtd-row>
          <mtd-col :span="12">
            <mtd-form-item label="公司名称:" prop="company">
              <mtd-input v-model="model.company" placeholder="请输入公司名称" />
            </mtd-form-item>
          </mtd-col>
          <mtd-col :span="12">
            <mtd-form-item label="职位序列:" prop="workrank">
              <mtd-input
                v-model="model.workrank"
                placeholder="请输入职位序列"
              />
            </mtd-form-item>
          </mtd-col>
        </mtd-row>
        <mtd-row>
          <mtd-col :span="12">
            <mtd-form-item label="入职职级:" prop="grade">
              <mtd-select v-model="model.grade" placeholder="请选择职级">
                <mtd-option label="等级1" value="1" />
                <mtd-option label="等级2" value="2" />
                <mtd-option label="等级3" value="3" />
              </mtd-select>
            </mtd-form-item>
          </mtd-col>
          <mtd-col :span="12">
            <mtd-form-item label="离职职级:" prop="grade">
              <mtd-select v-model="model.grade" placeholder="请选择离职职级">
                <mtd-option label="等级1" value="1" />
                <mtd-option label="等级2" value="2" />
                <mtd-option label="等级3" value="3" />
              </mtd-select>
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
              <mtd-input
                v-model="model.department"
                placeholder="请输入部门名称"
              />
            </mtd-form-item>
          </mtd-col>
        </mtd-row>
        <mtd-row>
          <mtd-col :span="12">
            <mtd-form-item label="期望收入:" prop="expectincome">
              <mtd-input
                v-model="model.expectincome"
                placeholder="请输入金额"
              />
            </mtd-form-item>
          </mtd-col>
          <mtd-col :span="12">
            <mtd-form-item label="基本薪资:" prop="salary">
              <mtd-input v-model="model.salary" placeholder="请输入基本薪资" />
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
        submitdata: '',
        grade: '',
        expectincome: '',
        workrank: '',
        worktype: '',
      },
      submitting: false,
      rules: {
        company: { required: true, message: '请填写公司名称' },
        bank: { required: true },
        type: { required: true },
        submitdata: { required: true },
        grade: { required: true },
        expectincome: { required: true },
      },
    };
  },
  methods: {
    handleSubmit () {
      this.submitting = true;
      this.$refs.form.validate().then(() => {
        this.submitting = false;
        this.visible = false;
        this.$mtd.message('提交成功');
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.demo-drawer-form {
  ::v-deep {
    .mtd-checkbox {
      margin-right: 30px;
    }
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
    .formheight1 {
      ::v-deep {
        .mtd-form-item-label {
          line-height: 20px;
        }
      }
    }
  }
}
.demo-action {
  text-align: right;
  > button {
    min-width: 80px;
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
