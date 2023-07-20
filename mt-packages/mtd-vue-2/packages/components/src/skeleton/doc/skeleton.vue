<template>
  <div class="demo-skeleton-wrapper">
    <div >
      <mtd-skeleton type="avatar"/>
      头像
    </div>
    <div >
      <mtd-skeleton :active="false"/>
      段落
    </div>
    <div >
      <mtd-skeleton type="picture"/>
      图片
    </div>
  </div>
</template>

<style scoped>
.demo-skeleton-wrapper {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.demo-skeleton-wrapper > div{
  width: 250px;
  height: 150px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
}


</style>
