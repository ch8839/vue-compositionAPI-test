<template>
  <div class="demo-full-width">
    <mtd-input-search v-model="val" :loading="loading" :enter-button="enterButton" @search="handleSearch" />
    <br>
    <mtd-switch v-model="enterButton" />&nbsp;&nbsp;按钮外置
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      enterButton: true,
      val: "",
    }
  },
  methods: {
    handleSearch(val) {
      this.loading = true
      setTimeout(() => {
        console.log(val, "搜索完成")
        this.loading = false
      }, 1000)
    },
  },
}
</script>
