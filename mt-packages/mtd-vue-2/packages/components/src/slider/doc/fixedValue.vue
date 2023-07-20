<template>
  <div class="demo-box">
    <mtd-slider
        v-model="value"
        :fixed-value="fixedValue"
        :format-tooltip="formatTooltip" /><br>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value: 20,
      fixedValue: 20,
    };
  },
  methods: {
    formatTooltip (v) {
      return `${v}%`;
    },
  },
};
</script>
