<template>
  <mtd-input
    v-model="value"
    placeholder="最大长度为10"
    :maxLength="10"
    showCount
  />
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
