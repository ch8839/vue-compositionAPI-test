<template>
  <mtd-table
    :data="tableData2"
    :row-class="tableRowClassName">
    <mtd-table-column
      prop="date"
      label="日期"
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

<style>
  .mtd-table .warning-row {
    background: oldlace;
  }

  .mtd-table .success-row {
    background: #f0f9eb;
  }
</style>

<script>
export default {
  data () {
    return {
      tableData2: [{
        date: '2016-05-02',
        name: '美小团',
        address: '北京市朝阳区望京东路四号',
      }, {
        date: '2016-05-04',
        name: '美小团',
        address: '北京市朝阳区望京东路四号',
      }, {
        date: '2016-05-01',
        name: '美小团',
        address: '北京市朝阳区望京东路四号',
      }, {
        date: '2016-05-03',
        name: '美小团',
        address: '北京市朝阳区望京东路四号',
      }],
    };
  },
  methods: {
    tableRowClassName ({row, rowIndex}) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },
  },
};
</script>
