<template>
  <div class="demo-full-width" style="text-align:left">
    <p>在底部</p>
    <div class="demo-tabs-show tabs-show-bottom">
      <mtd-tabs tab-position="bottom" v-model="activeName1">
        <mtd-tab-pane label="Tab1" value="Tab1">
          示例内容:<br />明月几时有？把酒问青天。不知天上宫阙，今夕是何年。
        </mtd-tab-pane>
        <mtd-tab-pane label="Tab2" value="Tab2">Tab2</mtd-tab-pane>
        <mtd-tab-pane label="Tab3" value="Tab3">Tab3</mtd-tab-pane>
      </mtd-tabs>
    </div>

    <p>垂直居左</p>
    <div class="demo-tabs-show">
      <mtd-tabs tab-position="left" v-model="activeName2">
        <mtd-tab-pane label="Tab1" value="Tab1">
          示例内容:<br />明月几时有？把酒问青天。不知天上宫阙，今夕是何年。
        </mtd-tab-pane>
        <mtd-tab-pane label="Tab2" value="Tab2">Tab2</mtd-tab-pane>
        <mtd-tab-pane label="Tab3" value="Tab3">Tab3</mtd-tab-pane>
      </mtd-tabs>
    </div>

    <p>垂直居右</p>
    <div class="demo-tabs-show">
      <mtd-tabs tab-position="right" v-model="activeName3">
        <mtd-tab-pane label="Tab1" value="Tab1">
          示例内容:<br />明月几时有？把酒问青天。不知天上宫阙，今夕是何年。
        </mtd-tab-pane>
        <mtd-tab-pane label="Tab2" value="Tab2">Tab2</mtd-tab-pane>
        <mtd-tab-pane label="Tab3" value="Tab3">Tab3</mtd-tab-pane>
      </mtd-tabs>
    </div>
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
<style scoped>
  .demo-tabs-show{
    border-radius: 6px;
    background-color: #F9FAFC;
    padding: 12px;
    height: 200px;
    margin-bottom: 20px;
  }

  .tabs-show-bottom{
    display: flex;
    flex-direction: column-reverse;
  }
</style>
