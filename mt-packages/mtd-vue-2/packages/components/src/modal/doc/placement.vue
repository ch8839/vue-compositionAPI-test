<style lang="scss">
.demo-modal-top-center {
  .mtd-modal {
    margin-bottom: 20vh;
  }
}
</style>
<template>
  <div class="demo-full-width">
    <div class="demo-modal-btn-groups">
      <mtd-button type="primary" @click="openModal2"
        >距顶部20px的对话框</mtd-button
      >
      <mtd-button type="primary" @click="openModal3"
        >中心偏上的对话框</mtd-button
      >
      <mtd-button type="primary" @click="openModal4">居中的对话框</mtd-button>
    </div>

    <mtd-modal
      v-model="visible2"
      title="距顶部20px的对话框"
      width="400px"
      placement="top"
    >
      春江潮水连海平，海上明月共潮生。滟滟随波千万里，何处春江无月明！
      江流宛转绕芳甸，月照花林皆似霰；空里流霜不觉飞，汀上白沙看不见。
      江天一色无纤尘，皎皎空中孤月轮。江畔何人初见月？江月何年初照人？
      人生代代无穷已，江月年年望相似。不知江月待何人，但见长江送流水。
      <template v-slot:footer>
        <div class="demo-modal-footer">
          <mtd-button @click="closeModal2" type="panel">取消</mtd-button
          ><mtd-button type="primary" @click="closeModal2">确定</mtd-button>
        </div>
      </template>
    </mtd-modal>

    <mtd-modal
      v-model="visible3"
      class="demo-modal-top-center"
      title="中心偏上的对话框"
      width="400px"
    >
      春江潮水连海平，海上明月共潮生。滟滟随波千万里，何处春江无月明！
      江流宛转绕芳甸，月照花林皆似霰；空里流霜不觉飞，汀上白沙看不见。
      江天一色无纤尘，皎皎空中孤月轮。江畔何人初见月？江月何年初照人？
      人生代代无穷已，江月年年望相似。不知江月待何人，但见长江送流水。
      <template v-slot:footer>
        <div class="demo-modal-footer">
          <mtd-button @click="closeModal3" type="panel">取消</mtd-button
          ><mtd-button type="primary" @click="closeModal3">确定</mtd-button>
        </div>
      </template>
    </mtd-modal>

    <mtd-modal v-model="visible4" title="居中的对话框" width="400px">
      春江潮水连海平，海上明月共潮生。滟滟随波千万里，何处春江无月明！
      江流宛转绕芳甸，月照花林皆似霰；空里流霜不觉飞，汀上白沙看不见。
      江天一色无纤尘，皎皎空中孤月轮。江畔何人初见月？江月何年初照人？
      人生代代无穷已，江月年年望相似。不知江月待何人，但见长江送流水。
      <template v-slot:footer>
        <div class="demo-modal-footer">
          <mtd-button @click="closeModal4" type="panel">取消</mtd-button
          ><mtd-button type="primary" @click="closeModal4">确定</mtd-button>
        </div>
      </template>
    </mtd-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible2: false,
      visible3: false,
      visible4: false,
    };
  },
  methods: {
    openModal2() {
      this.visible2 = true;
    },
    closeModal2() {
      this.visible2 = false;
    },
    openModal3() {
      this.visible3 = true;
    },
    closeModal3() {
      this.visible3 = false;
    },
    openModal4() {
      this.visible4 = true;
    },
    closeModal4() {
      this.visible4 = false;
    },
  },
};
</script>
