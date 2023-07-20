<template>
  <div class="demo-full-width">
    <mtd-virtual  
      class="v-list"
      :visible="true"
      view-tag="div"
      :data="renderOptions"
      :row-height="36"
      :renderItem="renderOption"
    >
      
    </mtd-virtual>
  </div>
</template>
<script>
import User from "./user.json";
export default {
  data() {
    return {
      renderOptions: User.data
    };
  },

  methods: {
    renderOption({ row: opt, index }) {
      const h = this.$createElement;
      return h('div', { class: 'v-list-item' },`【${index}】${opt.label}`)
    },
  },
};
</script>

<style scoped>
.v-list-item {
  height: 36px;
  border: 1px solid red;
  width: 100%;
}

.v-list {
  max-height: 300px;
  width: 300px;
  overflow: auto;

  border: 1px solid #4c4c4c;
}

</style>