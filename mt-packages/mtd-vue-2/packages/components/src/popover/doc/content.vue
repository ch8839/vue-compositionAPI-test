<template>
  <div class="top">
    <mtd-popover trigger="hover" placement="top" v-model="visible">
      <mtd-button style="margin-right: 40px;">带按钮操作</mtd-button>
      <template #title>
        <div slot="title">
          <i class="demo-popover-aside mtdicon mtdicon-success-circle" style="font-size:16px" />
          弹出框的标题
          <i class="demo-popover-close mtdicon mtdicon-close" style="font-size:16px;float:right" @click="closePopover" />
        </div>
      </template>
      
      <template #content>
        <div class="demo-popover-content">
          <p>弹出框的内容，弹出框的内容。</p>
          <div class="demo-popover-actions">
            <mtd-button type="primary" size="small" style="margin-right:8px" @click="closePopover">确定</mtd-button>
            <mtd-button size="small" @click="closePopover">取消</mtd-button>
          </div>
        </div>
      </template>
    </mtd-popover>

  </div>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
    }
  },
  methods: {
    closePopover () {
      this.visible = false
    },
  },
}
</script>
<style lang='scss'>
  .demo-popover-content{
    h2{
      margin: 0 0 8px 0;
    }
    p{
      margin: 0;
      margin-left: 20px;
    }
  }
  .demo-popover-actions {
    margin-top: 12px;
    text-align: right;
  }
  .demo-popover-aside{
    font-size: 26px;
    margin-right: 4px;
    float: left;
    display: inline-block;
    color: #166ff7;
    vertical-align: top;
  }
  .demo-popover-panel{
    margin-left: 34px;
    /* display: inline-block; */
    vertical-align: top;
  }
  .demo-popover-close{
    cursor: pointer;
    color: rgba(0,0,0,0.9);
  }
</style>
