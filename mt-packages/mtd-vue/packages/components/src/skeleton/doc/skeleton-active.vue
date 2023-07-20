<template>
  <div class="demo-skeleton-wrapper">
    <div style="width:500px;">
      <div>
        <mtd-switch v-model="active" />&nbsp;是否开启动画
      </div>
      <div class="user-weibo">
        <mtd-skeleton type="avatar" :size="40" :active="active"/>
        <div class="user-content" >
          <mtd-skeleton :size="16" :line-num="1" :active="active"/>
          <mtd-skeleton :size="10" :line-num="1" :active="active"/>
          <br>
          <div style="display:flex">
            <mtd-skeleton :size="14" :line-num="4"  :active="active" style="margin-right: 12px"/>
            <mtd-skeleton type="picture" :active="active"/>
          </div>
        </div>
      </div>
       
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active:true,
    };
  },
};

</script>

<style scoped>
.demo-skeleton-wrapper {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.demo-skeleton-wrapper > div{
  width: 250px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
}

.user-weibo{
  padding: 12px;
  display: flex;
  width: 100%;
  height: 200px;
}

.user-content{
  margin-left: 8px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

</style>
