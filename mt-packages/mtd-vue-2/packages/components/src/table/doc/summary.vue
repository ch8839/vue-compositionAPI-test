<template>
  <mtd-table :data="tableData" show-summary
    :summary-method="getSummary"
    >
    <mtd-table-column
      prop="name"
      label="菜品名"
      width="180" />
    <mtd-table-column
      prop="value"
      label="单价(元)" />
    <mtd-table-column
      prop="count"
      label="数量(份)" />
    <mtd-table-column
      prop="total"
      label="销售额(元)" />
  </mtd-table>
</template>

<script>
export default {
  data () {
    return {
      tableData: [{
        name: '黑椒牛柳',
        value: 80.77,
        count: 95,
        total: 7673.15,
      }, {
        name: '麻辣香锅',
        value: 22.65,
        count: 88,
        total: 1993.20,
      }, {
        name: '糖醋莲藕',
        value: 14.30,
        count: 18,
        total: 257.40,
      }],
    };
  },
  methods: {
    getSummary ({columns, data}) {
      return columns.map((column, index) => {
        if (index === 0) {
          return '合计';
        } else if (index === columns.length - 1) {
          const values = data.map((item) => item[column.prop]);
          return values.reduce((count, value) => {
            count += value;
            return count;
          }, 0);
        }
        return '';
      });
    },
  },
};
</script>
