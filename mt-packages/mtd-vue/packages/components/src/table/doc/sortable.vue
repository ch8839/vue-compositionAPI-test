<template>
  <mtd-table
    :data="tableData"
    :sort-order.sync="orderData">
    <mtd-table-column
      prop="date"
      label="日期"
      sortable
      :sort-method="sort"
      width="180" />
    <mtd-table-column
      prop="name"
      label="姓名"
      width="180" />
    <mtd-table-column
      prop="address"
      label="地址" />
  </mtd-table>
</template>

<script>
export default {
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '美小团',
        address: '北京市朝阳区望京东路四号',
      }, {
        date: '2016-05-04',
        name: '美小团',
        address: '北京市朝阳区望京东路四号 1517 号',
      }, {
        date: '2016-05-01',
        name: '美小团',
        address: '北京市朝阳区望京东路四号 1519 号',
      }, {
        date: '2016-05-03',
        name: '美小团',
        address: '北京市朝阳区望京东路四号 1516 号',
      }],
      orderData: {
        prop: 'date',
        order: 'descending',
      },
    };
  },
  methods: {
    sort (row1, row2) {
      return row1.date > row2.date ? 1 : -1;
    },
  },
};
</script>
