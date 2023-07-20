<template>
  <div>
    <mtd-select
      v-model="value"
      :options="options"
      :key="options[0].label"
      style="width: 200px"
    >
      <mtd-option
        v-for="(item, index) in options"
        :key="item.value"
        :label="item.label"
        :index="index"
        :value="item.value"
        :disabled="item.disabled"
        :option="item"
      />
    </mtd-select>
    <mtd-button @click="click"> change </mtd-button>
  </div>
</template>
<script>
export default {
  name: "DemoSelectBase",
  data() {
    return {
      options: [
        {
          value: "李白",
          label: "李白",
        },
        {
          value: "李贺",
          label: "李贺",
        },
        {
          value: "杜甫",
          label: "杜甫",
          disabled: true,
        },
        {
          value: "白居易",
          label: "白居易",
        },
        {
          value: "屈原",
          label: "屈原",
        },
      ],
      value: "",
    };
  },
  methods: {
    click() {
      this.options[0].label = "xxxx";
    },
  },
};
</script>
