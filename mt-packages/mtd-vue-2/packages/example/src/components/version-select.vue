<template>
  <mtd-input-group class="select-wrap">
    <!-- <span class="tag" slot="prepend">{{ tag }}</span> -->
    <mtd-select class="select" v-model="version" style="width: 150px">
      <mtd-option
        v-for="item in versions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </mtd-select>
    <span class="tag" slot="append">{{ npmVersion }}</span>
  </mtd-input-group>
</template>

<script>
import MTD from '@components/index'

const versions = [
  { href: '/mtd-vue2', label: '@ss/mtd-vue2', value: '@ss/mtd-vue2' },
  { href: '/mtd-vue3', label: '@ss/mtd-vue3', value: '@ss/mtd-vue3' },
  { href: '/mtd/vue', label: '@ss/mtd-vue', value: '@ss/mtd-vue' },
  { href: '/mtd/vue-next', label: '@ss/mtd-vue-next', value: '@ss/mtd-vue-next' },
]

export default {
  name: 'VersionSelector',
  inheritAttrs: false,
  props: {
    tag: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      versions,
      version: versions[0].value,
      npmVersion: MTD.version,
    }
  },
  watch: {
    version: {
      immediate: false,
      handler (version) {
        window.location.href = versions.find(ele => {
          return ele.value === version
        }).href
      },
    },
  },
  methods: {

  },
}
</script>
<style lang="scss" scoped>
.select-wrap {
  width: auto;
  ::v-deep {
    .mtd-input-group-prepend {
      background-color: #fff;
    }
    .mtd-input {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
  .tag {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }
}
</style>
