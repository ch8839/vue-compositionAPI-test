<template>
  <div  class="demo-full-width">
    <p style="text-align: left;">下拉型</p>
    <mtd-tabs v-model="activeName7">
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
      <mtd-tab-drop label="更多">
        <mtd-tab-pane label="Tab5" value="Tab5">
          示例内容: <br />
          床前明月光，疑是地上霜。举头望明月，低头思故乡。
        </mtd-tab-pane>
        <mtd-tab-pane label="Tab6" value="Tab6">
          示例内容: <br />
          玉阶生白露，夜久侵罗袜。却下水晶帘，玲珑望秋月。
        </mtd-tab-pane>
        <mtd-tab-pane label="Tab7" value="Tab7">
          示例内容: <br />
          渌水净素月，月明白鹭飞。郎听采菱女，一道夜歌归。
        </mtd-tab-pane>
      </mtd-tab-drop>
    </mtd-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName7: 'Tab1',
    };
  },
};
</script>
