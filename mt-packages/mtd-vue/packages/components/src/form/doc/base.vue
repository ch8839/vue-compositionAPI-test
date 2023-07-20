<template>
  <mtd-form :model="formCustom" ref="formCustom" :rules="ruleCustom">
    <mtd-form-item label="主机名称" prop="hostname">
      <mtd-input type="text" v-model="formCustom.hostname"
        style="width: 260px;" />
    </mtd-form-item>
    <mtd-form-item label="管理员" prop="owner">
      {{ formCustom.owner }}
    </mtd-form-item>
    <mtd-form-item label="机房区域" prop="curzone">
      <mtd-input-group compact>
        <mtd-select type="text" v-model="formCustom.curzone" style="width: 100px;">
          <mtd-option :key="item.value"
            v-for="item in list1"
            :value="item.value"
            :label="item.label" />
        </mtd-select>
        <mtd-select type="text" v-model="formCustom.curhost">
          <mtd-option :key="item.value"
            v-for="item in list1.filter(v => v.value === formCustom.curzone).length
          ? list1.filter(v => v.value === formCustom.curzone)[0].children
          : []"
            :value="item.value"
            :label="item.label" />
        </mtd-select>
      </mtd-input-group>
    </mtd-form-item>
    <mtd-form-item label="类型" prop="type">
      <mtd-radio-group v-model="formCustom.type">
        <mtd-radio value="windows">windows</mtd-radio>
        <mtd-radio value="linux">Linux</mtd-radio>
      </mtd-radio-group>
    </mtd-form-item>
    <mtd-form-item label="CPU" prop="cpu">
      <mtd-radio-group v-model="formCustom.cpu">
        <mtd-radio-button value="2">2核</mtd-radio-button>
        <mtd-radio-button value="4">4核</mtd-radio-button>
        <mtd-radio-button value="8">8核</mtd-radio-button>
        <mtd-radio-button value="16">16核</mtd-radio-button>
      </mtd-radio-group>
    </mtd-form-item>
    <mtd-form-item label="购买台数" prop="number" style="width: 260px;">
      <mtd-select type="text" v-model="formCustom.number" style="width: 100px;">
        <mtd-option :value="1" label="1台" />
        <mtd-option :value="2" label="2台" />
        <mtd-option :value="3" label="3台" />
        <mtd-option :value="4" label="4台" />
      </mtd-select>
    </mtd-form-item>
    <mtd-form-item label="硬盘容量" prop="size">
      <mtd-slider v-model="formCustom.size" style="width: 350px;" />
    </mtd-form-item>
    <mtd-form-item label="主机编号" prop="serilize">
      <div
        v-for="(item, index) in formCustom.serilize"
        :key="index"
        style="display: inline-block">
        <mtd-input
          type="text"
          ref="serilize"
          v-model="formCustom.serilize[index]"
          style="width: 50px;"
          @input="handleSerilize" /><span style="padding: 10px" v-if="index < formCustom.serilize.length - 1">-</span>
      </div>
    </mtd-form-item>
    <mtd-form-item label="访问地址" prop="url">
      <mtd-input v-model="formCustom.url" style="width: 400px;">
        <template slot="prepend">http://</template>
        <template slot="append">
          <mtd-select v-model="formCustom.appendValue" style="width: 90px;">
            <mtd-option value=".com" label=".com" />
            <mtd-option value=".cn" label=".cn" />
          </mtd-select>
        </template>
      </mtd-input>
    </mtd-form-item>
    <mtd-form-item label="自动续费" prop="renewal">
      <mtd-checkbox v-model="formCustom.renewal">到期后自动续费</mtd-checkbox>
    </mtd-form-item>
    <mtd-form-item label="标签" prop="tags">
      <mtd-select v-model="formCustom.tags" placeholder="请选择" multiple
        style="width: 260px;">
        <mtd-option
          v-for="item in list2"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </mtd-select>
    </mtd-form-item>
    <mtd-form-item label="描述" prop="desc">
      <mtd-textarea placeholder="描述文本"
        v-model="formCustom.desc" style="width: 260px;"
        rows="3" :max-length="50" />
    </mtd-form-item>

    <mtd-form-item label="评分" prop="rate">
      <mtd-rate v-model="formCustom.rate"/>
    </mtd-form-item>

    <mtd-form-item>
      <mtd-button type="primary" style="margin-right: 12px;"
        @click="handleSubmit">
        立即创建
      </mtd-button>
      <mtd-button @click="handleReset">取消</mtd-button>
    </mtd-form-item>
  </mtd-form>
</template>

<script>
const validateHostname = (rule, value, callback) => {
  if (value.trim() === '') {
    callback(new Error('请输入主机名称'));
  } else {
    callback();
  }
};
export default {
  data () {
    return {
      formCustom: {
        hostname: '',
        owner: '李明/liming',
        curzone: '',
        curhost: '',
        type: 'windows',
        cpu: '2',
        number: 1,
        size: 0,
        serilize: ['0', '0', '0', '0'],
        url: '',
        appendValue: '.com',
        renewal: true,
        tags: [],
        desc: '',
        rate: 0,
      },
      ruleCustom: {
        curzone: {
          required: true,
          validator: (rule, value, callback) => {
            if (!this.formCustom.curzone) {
              return callback(new Error('请选择区域'));
            } else if (!this.formCustom.curhost) {
              return callback(new Error('请选择机房'));
            }
            callback();
          },
        },
        type: { required: true, message: '必填' },
        cpu: { required: true, message: '必填' },
        number: { required: true, type: 'number', message: '必填' },
        size: { required: true, message: '必填' },
        serilize: { required: true, message: '必填' },
        url: { required: true, message: '请输入地址' },
        hostname: [
          { required: true, message: '请输入主机名称' },
          { validator: validateHostname, trigger: 'blur' },
        ],
        rate: { required: true ,validator: (rule, value, callback) => {
            if (!value) {
              return callback(new Error('请输入评分结果（1~5分）'));
            } else {
              callback();
            }
          },},
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
      count: 0
    };
  },
  methods: {
    handleSerilize (v) {
      if (v.length === 3) {
        this.count = (++this.count) % this.$refs.serilize.length;
        this.$refs.serilize[this.count].focus();
      }
    },
    handleSubmit (name) {
      this.$refs.formCustom.validate((valid, errors) => {
        if (valid) {
          console.log('Success!');
        } else {
          console.error('Fail!', errors);
        }
      });
    },
    handleReset () {
      this.$refs.formCustom.resetFields();
    },
  },
};
</script>