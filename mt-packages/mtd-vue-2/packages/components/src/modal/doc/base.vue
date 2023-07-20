<template>
  <div>
    <mtd-button type="primary" @click="openModal1">预览效果</mtd-button>
    <mtd-modal title="对话框" v-model="visible1" width="400px" ref="aaa" class="🤡">
      <div>
        春江潮水连海平，海上明月共潮生。滟滟随波千万里，何处春江无月明！
        江流宛转绕芳甸，月照花林皆似霰；空里流霜不觉飞，汀上白沙看不见。
        江天一色无纤尘，皎皎空中孤月轮。江畔何人初见月？江月何年初照人？
        人生代代无穷已，江月年年望相似。不知江月待何人，但见长江送流水。
      </div>
      <template #footer>
        <div class="demo-modal-footer">
          <mtd-button @click="closeModal1" type="panel">取消</mtd-button
          ><mtd-button type="primary" @click="closeModal1">确定</mtd-button>
        </div>
      </template>
    </mtd-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible1: false,
    }
  },
  methods: {
    openModal1() {
      this.visible1 = true
      console.log(this.$refs.aaa)
    },
    closeModal1() {
      this.visible1 = false
    },
  },
}
</script>
