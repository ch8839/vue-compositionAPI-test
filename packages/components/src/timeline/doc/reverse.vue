<template>
  <div class="demo-timeline-wrap">
    <mtd-timeline class="demo-timeline-item-content-1">

      <mtd-timeline-item type="hollow" size="large">
        <div><b>12 个产品上线</b></div>
        <div class="desc">上线内容说明</div>
        <br>
        <template #reverse>
          <div class="time year">2022年</div>
        </template>
      </mtd-timeline-item>

      <mtd-timeline-item type="hollow">
        <div><b>产品2上线</b></div>
        <div class="desc">上线内容说明</div>
        <br>
        <template #reverse>
          <div class="time month">12月</div>
        </template>
      </mtd-timeline-item>

      <mtd-timeline-item type="disabled" size="small">
        <div><b>迭代2</b></div>
        <div class="desc">迭代内容说明</div>
        <br>
        <template #reverse>
          <div class="time month">11月</div>
        </template>
      </mtd-timeline-item>

      <mtd-timeline-item type="disabled" size="small">
        <div><b>迭代1</b></div>
        <div class="desc">迭代内容说明</div>
        <br>
        <template #reverse>
          <div class="time month">10月</div>
        </template>
      </mtd-timeline-item>

      <mtd-timeline-item type="hollow">
        <div><b>产品2上线</b></div>
        <div class="desc">上线内容说明</div>
        <br>
        <template #reverse>
          <div class="time month">12月</div>
        </template>
      </mtd-timeline-item>

      <mtd-timeline-item type="hollow" size="large">
        <div><b>12个产品上线</b></div>
        <div class="desc">发布具体内容</div>
        <br>
        <template #reverse>
          <div class="time year">2021年</div>
        </template>
      </mtd-timeline-item>

      <mtd-timeline-item type="hollow">
        <div><b>产品发布会</b></div>
        <div class="desc">发布具体内容</div>
        <br>
        <template #reverse>
          <div class="time month">12月</div>
        </template>
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

  .time{
    width: 100px;
    text-align: right;
  }

  .year{
    font-size: 18px
  }

}

</style>
