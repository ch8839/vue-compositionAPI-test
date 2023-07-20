<template>
  <div class="demo-full-width">
    <mtd-switch v-model="loading" />
    <br><br>
    <mtd-loading :loading="loading" :delay="500">
      <div class="loading-div">
        <span>被包裹的div</span>
      </div>
    </mtd-loading>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
    }
  },
}
</script>
<style scoped>
.loading-div{
  height: 200px;
  width: 100%;
  background: rgba(0, 136, 214, 0.5);
  color: rgb(0, 109, 172);

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
