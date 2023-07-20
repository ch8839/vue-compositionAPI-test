<template>
    <div class="demo-box" style="width:500px">
      <mtd-row type="flex" class="demo-slider-row" style="width: 100%">
        <mtd-col :span="16" >
          <mtd-slider v-model="value" @change="handleChange" />
        </mtd-col>
        <mtd-col :span="4" :offset="2">
          <mtd-input-number v-model="value" controls-position="right" :min="0" :max="100"/>
        </mtd-col>
      </mtd-row>
    </div>
</template>
<script>
export default {
  data () {
    return {
      value: 0,
    };
  },
  methods: {
    handleChange (v) {
      console.log(v);
    },
  },
};
</script>

<style lang="scss">

.demo-slider-row{

  .mtd-col{
    display: inline-flex;
    align-items: center;
    .mtd-slider{
      width: 100%;
    }
  }
}

</style>
