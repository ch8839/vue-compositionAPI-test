<template>
  <mtd-transfer
    :data="initData"
    v-model="checkedData"
    :pagination="{pageSize: 8}"
    style="height:400px"
  >
  </mtd-transfer>
</template>
<script>

const initData = (num) => {
  let result = [];
  for(let i = 0;i< num;i++){
    result.push({
      label: 'item - ' + i,
      key: i
    })
  }
  return result
}

export default {
  data () {
    return {
      checkedData: [],
      initData: initData(100),
    };
  },
};
</script>
