<template>
  <mtd-rate
    v-model="value10"
    :count="10"
    color="#FF4A47"
    icon="like-fill"
    void-icon="like-fill" />
</template>
<script>
export default {
  data () {
    return {
      value10: 1,
    };
  },
};
</script>
