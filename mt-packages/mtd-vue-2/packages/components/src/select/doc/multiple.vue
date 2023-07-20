<template>
  <div class="demo-full-width">

    <div class="type-and-use-size">
      <mtd-select 
        v-model="value" 
        placeholder="请选择"
        multiple 
        :closable="true"
      >
        <mtd-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled" />
      </mtd-select>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      value: [],
      options: [{
        value: '李白',
        label: '李白',
      }, {
        value: '李贺',
        label: '李贺',
      }, {
        value: '杜甫',
        label: '杜甫',
        disabled: true,
      }, {
        value: '白居易',
        label: '白居易',
      }, {
        value: '屈原',
        label: '屈原',
      }],

      collapseTags: false,
      closable: true,
    }
  },
}
</script>
<style lang="scss">
  .group-hr {
    opacity: 0.8;
    height: 1px; border: none;
    background-color: #D8DDE7;
    border-radius: 2px;
  }
  .type-and-use-size p {
    font-size: 14px;
    color: #464646;
    letter-spacing: 0;
  }
  .type-and-use-size {
    margin: 0 20px;
    display:inline-block;
    width: 25%;
    text-align: left;
    vertical-align: top;
  }
</style>
