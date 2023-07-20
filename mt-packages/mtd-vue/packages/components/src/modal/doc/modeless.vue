<template>
  <div>
    <mtd-button type="primary" @click="openModal1">非模态对话框</mtd-button>
    <mtd-modal title="对话框" v-model="visible1" width="400px" :mask="false">
      <div>
        非模态对话框<br/>
        内容<br/>
      </div>
      <template v-slot:footer>
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
    };
  },
  methods: {
    openModal1() {
      this.visible1 = true;
    },
    closeModal1() {
      this.visible1 = false;
    },
  },
};
</script>
