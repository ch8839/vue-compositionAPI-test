<template>
  <div class="demo-full-width">
    <span
@click="toggleExpended" class="demo-collapse-poem"
      :class="{ 'expended': expended }">
      秋词 <i style="color: #D3D8E4;" class="mtdicon mtdicon-down" />
    </span>
    <mtd-collapse-transition>
      <div v-show="expended">
      <span style="padding: 10px; display: inline-block;background-color: #f7f8fc;">
      自古逢秋悲寂寥，我言秋日胜春朝。<br>
      晴空一鹤排云上，便引诗情到碧霄。
      </span>
      </div>
    </mtd-collapse-transition>
  </div>
</template>
<script>
export default {
  data () {
    return {
      expended: false,
    }
  },
  methods: {
    toggleExpended () {
      this.expended = !this.expended
    },
  },
}
</script>
<style lang='scss'>
  .demo-collapse-poem {
    cursor: pointer;

    .mtdicon-down {
      transition: transform .3s;
      transform: rotate(0deg);
    }

    &.expended {
      .mtdicon-down {
        transform: rotate(180deg);
      }
    }
  }
</style>
