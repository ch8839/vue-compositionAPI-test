<template>
  <div>
    <h2>optional-api</h2>
    <!-- <a href="javascript:console.log(11)">click</a> -->
    <p>{{ msg }}</p>

    <h2>exp1</h2>
    <test1 :msg="msg" />

    <h2>exp2</h2>
    <test2 :msg="msg" />

    <h2>exp3</h2>
    <test3 :msg="msg"></test3>
  </div>
</template>

<script>
import test1 from "./test1.vue";
import test2 from "./test2.vue";
import test3 from "./test3.tsx";
export default {
  data() {
    return {
      msg: "hello",
    };
  },
  components: {
    test1,
    test2,
    test3
  }
};
</script>
