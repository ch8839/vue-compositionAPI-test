<template>
  <div>
    <mtd-button type="primary" @click="openModal5">异步关闭的对话框</mtd-button>
    <mtd-modal
      :mask-closable="false"
      width="400px"
      v-model="visible5"
      title="异步关闭的对话框"
    >
      春江潮水连海平，海上明月共潮生。滟滟随波千万里，何处春江无月明！
      江流宛转绕芳甸，月照花林皆似霰；空里流霜不觉飞，汀上白沙看不见。
      江天一色无纤尘，皎皎空中孤月轮。江畔何人初见月？江月何年初照人？
      人生代代无穷已，江月年年望相似。不知江月待何人，但见长江送流水。
      <template v-slot:footer>
        <div class="demo-modal-footer">
          <mtd-button @click="cancelModal5" type="panel">取消</mtd-button
          ><mtd-button
            type="primary"
            :loading="submitting"
            @click="submitModal5"
            >提交</mtd-button
          >
        </div>
      </template>
    </mtd-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible5: false,
      submitting: false,
    };
  },
  methods: {
    openModal5() {
      this.visible5 = true;
    },
    cancelModal5() {
      this.visible5 = false;
    },
    submitModal5() {
      this.submitting = true;
      setTimeout(() => {
        this.submitting = false;
        this.visible5 = false;
      }, 3000);
    },
  },
};
</script>
