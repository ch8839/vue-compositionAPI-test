<template>
  <div>
    <h2>simple store</h2>
    <A  />
    <B  />
    <C />
  </div>
</template>

<script>
import A from "./a.vue";
import B from "./b.vue";
import C from "./c.vue";

export default {
  data() {
    return {
      msg: "hhh",
    };
  },
  components: {
    A,
    B,
    C,
  }
};
</script>
