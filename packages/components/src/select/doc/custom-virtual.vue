<template>
  <div>
    <mtd-select
      v-model="value"
      style="width: 200px" 
      :options="options"
      virtual
      :virtualOption="{
        rowHeight: 50,
      }"
     >

      <template #empty>
        ┓( ´∀` )┏ 这里啥都没有
      </template>

      <template #option="option">
        <div class="custom-new-option">
          ⭐️{{option.label}}
        </div>
      </template>
    </mtd-select>
  </div>
</template>
<script>
export default {
  name: 'DemoSelectBase',
  data () {
    return {
      options: [],
      value: '',
    }
  },
  created() {
    const arr = [];

    for (let i = 0; i < 100; i++) {
      let obj = {
        label: '【' + i + '】',
        value: i
      };
      arr.push(obj);
    }

    this.options = arr
  }
}
</script>

<style scoped>
  .custom-new-option{
    border-bottom: 1px dashed rgba(0,0,0,0.3);
    height: 50px;
    display: flex;
    align-items: center;
  }
</style>