<template>
  <mtd-input v-model="value" placeholder="具体文案" @change="handleChange" />
</template>

<script>
export default {
  data() {
    return {
      value: "",
    }
  },
  methods: {
    handleChange(value) {
      console.log(value)
    },
  },
}
</script>
