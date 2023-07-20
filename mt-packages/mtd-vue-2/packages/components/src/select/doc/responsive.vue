<template>
  <div class="type-and-use-size">
    <mtd-select
      v-model="value"
      placeholder="请选择"
      multiple
      clearable
      :filterable="true"
      max-count="responsive"
      :options="options"
      style="width: 100%"
      show-select-all
      virtual
    />
  </div>
</template>

<script>
import User from "./user.json"
export default {
  data() {
    return {
      options: User.data.splice(0,100),
      value: [],
    }
  },
}
</script>
<style lang="scss" scoped>
.type-and-use-size {
  margin: 0;
  padding: 0 10px;
  display: inline-block;
  width: 100%;
  text-align: left;
  vertical-align: top;
}
</style>
