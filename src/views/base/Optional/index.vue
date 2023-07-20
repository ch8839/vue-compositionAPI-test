<template>
  <div>
    <h2>optional-api</h2>
    <p>count: {{count}}</p>
    <button @click="handleAdd">add</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 1,
    };
  },
  methods: {
    handleAdd() {
      this.count++
    }
  }
};
</script>
