<template>
  <div
    style="
      text-align: left;
      display: flex;
      align-items: baseline;
      justify-content: space-around;
      width: 100%
    "
  >
    <mtd-select :options="options" v-model="value" />

    <mtd-select :options="options" v-model="value2" disabled />

    <mtd-select :options="options" v-model="value3" status="error" />
  </div>
</template>
<script>

export default {
  data() {
    return {
      options: [
        {
          "value": 1,
          "label": "苹果"
        },
        {
          "value": 2,
          "label": "香蕉"
        },
        {
          "value": 3,
          "label": "西瓜"
        },
        {
          "value": 4,
          "label": "土豆"
        },
        {
          "value": 5,
          "label": "白菜"
        }
      ],
      value: "",
      value1: "",
      value2: "Barbara Martinez",
      value3: "Barbara Martinez",
    };
  },
};
</script>
