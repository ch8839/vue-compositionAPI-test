<template>
  <div>
    <p>超出省略</p>
    <mtd-picker
      multiple
      clearable
      placeholder="请选择"
      v-model="value"
      style="max-width: 150px"
      :options="users"
    />
    <p>显示数量</p>
    <mtd-picker
      clearable
      show-select-all
      placeholder="请选择"
      :max-count="1"
      multiple
      v-model="value2"
      :options="users"
    />
    <p>自定义显示</p>
    <mtd-picker
      multiple
      clearable
      placeholder="请选择"
      :options="users"
      v-model="value3"
    >
      <span slot="selected" slot-scope="scope">城市</span>
    </mtd-picker>
  </div>
</template>
<script>
import User from "./user.json";

export default {
  data() {
    return {
      value: [],
      value2: [],
      value3: [],
      users: User.data,
    };
  },
};
</script>
