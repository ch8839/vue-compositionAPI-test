<template>
  <mtd-input-group class="select-wrap">
    <template v-slot:prepend>
      <span class="tag">{{ tag }}</span>
    </template>
    <mtd-select class="select" v-model="version" style="width: 150px">
      <mtd-option
        v-for="item in versions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </mtd-select>
  </mtd-input-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import MTD from '@components/index';

interface Version {
  href: string;
  label: string;
  value: string;
}
const versions: Version[] = [
  { href: '/mtd/vue-next', label: MTD.version, value: MTD.version },
  { href: '/mtd/vue', label: 'Vue 2.x', value: 'Vue 2.x' },
];

export default defineComponent({
  name: 'VersionSelector',
  inheritAttrs: false,
  props: {
    tag: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      versions,
      version: versions[0].value,
    };
  },
  watch: {
    version: {
      immediate: false,
      handler(version: string) {
        window.location.href = versions.find((ele) => {
          return ele.value === version;
        })!.href;
      },
    },
  },
  methods: {},
});
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
