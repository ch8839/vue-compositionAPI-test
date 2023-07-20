<template>
<div class="demo-flex">
  <mtd-textarea
    placeholder="输入内容不超过50个字符"
    v-model="value"
    style="width: 260px"
    rows="3"
    :max-length="50"
  />
  <mtd-textarea
    placeholder="输入内容不超过50个字符"
    v-model="value"
    style="width: 260px"
    rows="3"
    :show-count="true"
    :max-length="50"
  />
</div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
    };
  },
};
</script>
