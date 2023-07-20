<template>
  <div class="demo-full-width">
    <p>斑马线样式</p>
    <mtd-table :data="tableData" striped style="margin-bottom: 40px;">
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
    <p>显示列分割线样式</p>
    <mtd-table :data="tableData" bordered>
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
  </div>
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
    };
  },
};
</script>
