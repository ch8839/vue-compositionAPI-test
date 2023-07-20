<template>
  <div class="demo-skeleton-wrapper">
    <div>
      <mtd-skeleton type="avatar" :loading="loading1">
        <div class="skeleton-avatar" />
      </mtd-skeleton>
      <mtd-skeleton :loading="loading2">
        <div>
          <p>骨架屏组件真的很好用很棒的</p>
          <p>骨架屏组件真的很好用很棒的</p>
          <p>骨架屏组件真的很好用很棒的</p>
        </div>
      </mtd-skeleton>
      <mtd-skeleton type="picture" :loading="loading3">
        <div class="skeleton-pic" />
      </mtd-skeleton>
      <mtd-button @click="open" style="margin-top:12px">逐渐加载</mtd-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading1: true,
      loading2: true,
      loading3: true,
    };
  },
  methods: {
    open() {
      this.loading1 = true
      this.loading2 = true
      this.loading3 = true
      setTimeout(() => {
        this.loading1 = false
      }, 2000);
      setTimeout(() => {
        this.loading2 = false
      }, 4000);
      setTimeout(() => {
        this.loading3 = false
      }, 6000);
    }
  }
};
</script>

<style>
.demo-skeleton-wrapper {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.demo-skeleton-wrapper .skeleton-avatar{
  width: 36px;
  height: 36px;
  background: #a36a00;
  border-radius: 50%;
}

.demo-skeleton-wrapper .skeleton-pic {
  width: 190px;
  height: 110px;
  background: #4D97FF ;
  border-radius: 6px;
}

.demo-skeleton-wrapper > div{
  width: 200px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
}

</style>
