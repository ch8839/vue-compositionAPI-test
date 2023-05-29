<template>
  <div style="width:100%">

    <div class="demo-props-option">
      <div>
        <span>input类型：</span>
        <mtd-radio-group v-model="genre">
          <mtd-radio-button value="">线框</mtd-radio-button>
          <mtd-radio-button value="area">面型</mtd-radio-button>
          <mtd-radio-button value="line">单线</mtd-radio-button>
        </mtd-radio-group>
      </div>
      <br>
      <div>
        <span>是否显示状态icon： </span>
        <mtd-switch v-model="hasFeedback" />
      </div>
    </div>
    <br><br><br>

    <div class="demo-block-row">
      <mtd-input v-model="value" :genre="genre" />
      <mtd-input disabled model-value="禁用状态" :genre="genre" />
      <mtd-input readonly model-value="只读状态" :genre="genre" />
      <mtd-input loading model-value="加载状态" :genre="genre" />
    </div>
    <div class="demo-block-row">
      <div>
        <mtd-input show-count :genre="genre" status="error" model-value="美小团" :has-feedback="hasFeedback" />
        <div class="mtd-form-item-error-tip">用户不存在</div>
      </div>
      <div>
        <mtd-input status="warning" :genre="genre" model-value="meixiaotuan" :has-feedback="hasFeedback" />
        <div class="mtd-form-item-warning-tip">建议使用中文名字</div>
      </div>
      <div>
        <mtd-input status="success" :genre="genre" model-value="美小团" :has-feedback="hasFeedback" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: '一般状态',
      genre:'',
      hasFeedback: false,
    }
  },
}
</script>
