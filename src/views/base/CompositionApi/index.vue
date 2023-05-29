<template>
  <div>
    <h2>optional-api</h2>
    <!-- <a href="javascript:console.log(11)">click</a> -->
    <p>{{ msg }}</p>
    <test1 :msg="msg" />
    <test2 :msg="msg" />
    <test4></test4>
  </div>
</template>

<script>
import test1 from "./test1.vue";
import test2 from "./test2.vue";
import test4 from "./test4.tsx";
export default {
  data() {
    return {
      msg: "hhh",
    };
  },
  components: {
    test1,
    test2,
    test4
  }
};
</script>
