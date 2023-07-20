<template>
  <div class="demo-box">
    <mtd-card class="card-box" title="早发白帝城">
      <div class="annotate">唐代-李白</div>
      <div>
        <p>朝辞白帝彩云间，千里江陵一日还。</p>
        <p style="margin-bottom:0">两岸猿声啼不住，轻舟已过万重山。</p>
      </div>
    </mtd-card>
  </div>
</template>

<style lang="scss">
  .demo-box {
    display: inline-block;
    width: 400px;
    text-align: left;
    .card-box {
      .title {
        line-height: 22px;
        font-weight: 500;
        font-size: 16px;
        margin-bottom: 8px;
      }
      .annotate {
        color: #999;
        font-size: 12px;
        line-height: 17px;
        margin-bottom: 12px;
      }
    }
    .demo-card-icon-btn {
      width: 16px;
      height: 16px;
      padding: 0;
    }
  }
</style>
