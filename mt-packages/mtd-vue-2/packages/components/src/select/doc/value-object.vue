<template>
  <mtd-row class="demo-full-width">
    <mtd-col :span="12">
      <p>value-key</p>
      <mtd-select
        v-model="value"
        style="width: 200px"
        value-key="id"
      >
        <mtd-option
          v-for="(item, index) in options"
          :key="item.index"
          :label="item.name"
          :value="item"
        />
      </mtd-select>
    </mtd-col>
    <mtd-col :span="12">
      <p>自定义显示</p>
      <mtd-select
        v-model="value2"
        style="width: 200px"
        value-key="id"
        :formatter="formatter"
      >
        <mtd-option
          v-for="(item, index) in options"
          :key="item.index"
          :label="item.name"
          :value="item"
          :index="index"
        />
      </mtd-select>
    </mtd-col>
  </mtd-row>
</template>
<script>
export default {
  name: "DemoValueObjectBase",
  data() {
    return {
      options: [
        {
          id: 1,
          name: "李白",
          mis: "libai",
        },
        {
          id: 2,
          name: "李贺",
          mis: "lihe",
        },
        {
          id: 3,
          name: "杜甫",
          mis: "dufu",
        },
        {
          id: 4,
          name: "白居易",
          mis: "baijuyi",
        },
        {
          id: 5,
          name: "屈原",
          mis: "quyuan",
        },
      ],
      value: {
        id: 2,
        name: "李贺",
        mis: "lihe",
      },
      value2: {
        id: 2,
        name: "李贺",
        mis: "lihe",
      },
    };
  },
  methods: {
    formatter({ value }) {
      return `${value.name} - ${value.mis}`;
    },
  },
};
</script>
