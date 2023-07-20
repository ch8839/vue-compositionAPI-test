<template>
  <div>
    <mtd-picker
      clearable
      placeholder="请选择"
      v-model="value2"
      :options="users"
      disabled
    />

    &nbsp;&nbsp;&nbsp;&nbsp;
    <mtd-picker
      :options="users"
      clearable
      show-select-all
      placeholder="请选择"
      multiple
      v-model="value"
    />
  </div>
</template>
<script>
import User from "./user.json";
export default {
  data() {
    return {
      value: [],
      value2: "",
      users: User.data,
    };
  },
};
</script>
