<template>
  <div>
    <mtd-button type="primary" @click="visible1 = true">打开第一层抽屉</mtd-button>
    <mtd-drawer v-model="visible1" title="基础样式" width="600px" :mask="false" >
      <div>
        春江潮水连海平，海上明月共潮生。<br/>
        滟滟随波千万里，何处春江无月明！<br/>
        江流宛转绕芳甸，月照花林皆似霰。<br/>
        空里流霜不觉飞，汀上白沙看不见。<br/>
        江天一色无纤尘，皎皎空中孤月轮。<br/>
        江畔何人初见月？江月何年初照人？<br/>
        人生代代无穷已，江月年年只相似。<br/>
        不知江月待何人，但见长江送流水。<br/>
        白云一片去悠悠，青枫浦上不胜愁。<br/>
        谁家今夜扁舟子？何处相思明月楼？<br/><br/><br/>
      </div>
      <template #footer>
        <div class="demo-drawer-footer-btn-wrapper">
          <mtd-button type="primary" @click="visible2 = true">打开第二层抽屉</mtd-button>
        </div>
      </template>
    </mtd-drawer>
    <mtd-drawer v-model="visible2" title="静夜思" width="400px" :mask="false">
      <div>
        窗前明月光，疑是地上霜。
        举头望明月，低头思故乡。
      </div>
    </mtd-drawer>
  </div>
</template>
<script>
export default {
  data () {
    return {
      visible1: false,
      visible2: false,
    };
  },
};
</script>
