<template>
  <mtd-form>
    <mtd-form-item>
      <span slot="label">
        <div style="display:flex;align-items:center;justify-content: right;">
        任务名
        <mtd-tooltip placement="top" content="任务名会同步成数据表名">
          <i class="mtdicon mtdicon-question-circle-o demo-icon demo-icon-label" />
        </mtd-tooltip>
        </div>
      </span>
      <mtd-input type="text" v-model="value1" />
    </mtd-form-item>
    <mtd-form-item label="会员名">
      <mtd-input v-model="value2" />
      <mtd-tooltip placement="top" content="会员名会同步到后台系统">
        <i class="mtdicon mtdicon-question-circle-o demo-icon demo-icon-label" />
      </mtd-tooltip>
    </mtd-form-item>
    </mtd-form>
</template>
<script>
export default {
  data () {
    return {
      value1: '',
      value2: '',
    };
  },
};
</script>

<style lang="scss" scoped>
.demo-icon-label{
  font-size: 16px;
  color: rgba(0,0,0,0.38);
  margin-left: 4px;
}
</style>
