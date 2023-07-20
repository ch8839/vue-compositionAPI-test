<template>
  <div class="demo-full-width" style="text-align:left">
    <p><b>小型</b></p>
    <mtd-tabs v-model="activeName1" size="small">
      <mtd-tab-pane label="Tab1" value="Tab1">
        示例内容:<br />
        明月几时有？把酒问青天。不知天上宫阙，今夕是何年。
      </mtd-tab-pane>
      <mtd-tab-pane label="Tab2" value="Tab2">
        示例内容: <br />
        我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间！
      </mtd-tab-pane>
      <mtd-tab-pane label="Tab3" value="Tab3">
        示例内容: <br />
        转朱阁，低绮户，照无眠。 不应有恨，何事长向别时圆？
      </mtd-tab-pane>
      <mtd-tab-pane label="Tab4" value="Tab4">
        示例内容: <br />
        人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。
      </mtd-tab-pane>
    </mtd-tabs>
    <br />
    <br />
    <p><b>基础型</b></p>
    <mtd-tabs v-model="activeName2">
      <mtd-tab-pane label="Tab1" value="Tab1">
        示例内容:<br />
        明月几时有？把酒问青天。不知天上宫阙，今夕是何年。
      </mtd-tab-pane>
      <mtd-tab-pane label="Tab2" value="Tab2">
        示例内容: <br />
        我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间！
      </mtd-tab-pane>
      <mtd-tab-pane label="Tab3" value="Tab3">
        示例内容: <br />
        转朱阁，低绮户，照无眠。 不应有恨，何事长向别时圆？
      </mtd-tab-pane>
      <mtd-tab-pane label="Tab4" value="Tab4">
        示例内容: <br />
        人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。
      </mtd-tab-pane>
    </mtd-tabs>
    <br />
    <br />
    <p><b>大型</b></p>
    <mtd-tabs v-model="activeName3" size="large">
      <mtd-tab-pane label="Tab1" value="Tab1">
        示例内容:<br />
        明月几时有？把酒问青天。不知天上宫阙，今夕是何年。
      </mtd-tab-pane>
      <mtd-tab-pane label="Tab2" value="Tab2">
        示例内容: <br />
        我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间！
      </mtd-tab-pane>
      <mtd-tab-pane label="Tab3" value="Tab3">
        示例内容: <br />
        转朱阁，低绮户，照无眠。 不应有恨，何事长向别时圆？
      </mtd-tab-pane>
      <mtd-tab-pane label="Tab4" value="Tab4">
        示例内容: <br />
        人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。
      </mtd-tab-pane>
    </mtd-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName1: 'Tab1',
      activeName2: 'Tab1',
      activeName3: 'Tab1',
    };
  },
};
</script>
