<template>
  <div>
    <div class="type-and-use-size">
      <p>线性</p>
      <mtd-select :options="options" v-model="value" />
    </div>
    <div class="type-and-use-size">
      <p>面型</p>
      <mtd-select :options="options" v-model="value2" genre="area" />
    </div>
    <div class="type-and-use-size">
      <p>单线</p>
      <mtd-select :options="options" v-model="value3" genre="line" />
    </div>
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
      value2: "",
      value3: "",
    };
  },
};
</script>

<style lang="scss">
.type-and-use-size p {
  font-size: 14px;
  color: #464646;
  letter-spacing: 0;
}
.type-and-use-size {
  margin: 0 20px;
  display: inline-block;
  width: 25%;
  text-align: left;
  vertical-align: top;
}
</style>
