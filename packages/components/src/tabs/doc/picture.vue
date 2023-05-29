<template>
  <div style="text-align: left;"  class="demo-full-width">
    <mtd-tabs v-model="activeName10">
      <mtd-tab-pane icon="piechart" label="饼图" value="饼图">
        饼图，或称饼状图，是一个划分为几个扇形的圆形統計圖表，用于描述量、频率或百分比之间的相对关系。
        在饼图中，每个扇区的弧长（以及圆心角和面积）大小为其所表示的数量的比例。
      </mtd-tab-pane>
      <mtd-tab-pane
        icon="barschart"
        label="柱状图"
        value="柱状图"
      >
        柱状图(bar
        chart)，是一种以长方形的长度为变量的表达图形的统计报告图，由一系列高度不等的纵向条纹表示数据分布的情况，用来比较两个或以上的价值（不同时间或者不同条件），只有一个变量，通常利用于较小的数据集分析。
      </mtd-tab-pane>
      <mtd-tab-pane
        icon="areachart"
        label="折线图"
        value="折线图"
      >
        折线图是排列在工作表的列或行中的数据可以绘制到折线图中。
        折线图可以显示随时间（根据常用比例设置）而变化的连续数据，因此非常适用于显示在相等时间间隔下数据的趋势。
      </mtd-tab-pane>
    </mtd-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName10: '饼图',
    };
  },
};
</script>
