<template>
  <mtd-tooltip placement="top">
    <div slot="content">
      {{ getLabel(options5, value5) }}
    </div>
    <div>
      <mtd-select v-model="value5" style="width: 200px" ref="baby">
        <mtd-option
          v-for="item in options5"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <mtd-tooltip :content="item.label" placement="top">
            <div class="option-item-ellipsis" style="width: 176px">{{item.label}}</div>
          </mtd-tooltip>
        </mtd-option>
      </mtd-select>
    </div>
  </mtd-tooltip>
</template>
<script>
export default {
  data() {
    return {
      options5: [
        {
          value: "李白",
          label: "天生我材必有用，千金散尽还复来",
        },
        {
          value: "李贺",
          label: "大漠沙如雪，燕山月似钩",
        },
        {
          value: "杜甫",
          label: "会当凌绝顶，一览众山小",
          disabled: true,
        },
        {
          value: "白居易",
          label: "在天愿作比翼鸟，在地愿为连理枝",
        },
        {
          value: "屈原",
          label: "路漫漫其修远兮，吾将上下而求索",
        },
      ],
      value5: "李贺",
    };
  },
  methods: {
    getLabel(options, value) {
      const option = options.find((opt) => opt.value === value);
      return option ? option.label : "";
    },
  },

  mounted() {
    console.log(this.$refs.baby)
  }
};
</script>

<style>

.option-item-ellipsis{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>
