<template>
  <div class="demo-timeline-wrap">
    <mtd-radio-group v-model="mode">
      <mtd-radio value="right">右对齐</mtd-radio>
      <mtd-radio value="">左对齐</mtd-radio>
      <mtd-radio value="alternate">交替对齐</mtd-radio>
    </mtd-radio-group>
    <br><br><br>

    <mtd-timeline :mode="mode" class="demo-timeline-item-content-1">
      <mtd-timeline-item type="hollow">
        <div><b>第1个节点的内容</b></div>
        <div class="desc">第1个节点的内容的辅助信息</div>
        <div class="time">2202-07-16 12:45</div>
        <br>
      </mtd-timeline-item>
      <mtd-timeline-item type="hollow">
        <div><b>第2个节点的内容</b></div>
        <div class="desc">第2个节点的内容的辅助信息</div>
        <div class="time">2202-07-16 11:22</div>
        <br>
      </mtd-timeline-item>
      <mtd-timeline-item type="hollow">
        <div><b>第3个节点的内容</b></div>
        <div class="desc">第3个节点的内容的辅助信息</div>
        <div class="time">2202-07-16 10:13</div>
        <br>
      </mtd-timeline-item>
      <mtd-timeline-item type="hollow">
        <div><b>第4个节点的内容</b></div>
        <div class="desc">第4个节点的内容的辅助信息</div>
        <div class="time">2202-07-16 07:10</div>
        <br>
      </mtd-timeline-item>
      <mtd-timeline-item type="hollow">
        <div><b>第5个节点的内容</b></div>
        <div class="desc">第5个节点的内容的辅助信息</div>
        <div class="time">2202-07-16 06:00</div>
        <br>
      </mtd-timeline-item>
    </mtd-timeline>
  </div>
</template>
<style lang="scss" scoped>
.demo-timeline-wrap {
  width: 400px;
  margin: 0 auto;

  .desc,.time{
    font-size: 12px;
    line-height: 20px;
    color: rgba(0,0,0,0.50);
  }
}
</style>

<script>
export default {
  data () {
    return {
      mode: 'right',
    };
  },
};
</script>
