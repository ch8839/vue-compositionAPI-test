<template>
  <div class="demo-full-width">
    <p>小号</p>
    <mtd-table :data="tableData" size="small" style="margin-bottom: 40px;">
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
    <p>默认</p>
    <mtd-table :data="tableData" style="margin-bottom: 40px;">
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
    <p>大号</p>
    <mtd-table :data="tableData" size="large">
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
        date: '2016-05-03',
        name: '美小团',
        province: '北京',
        city: '朝阳区',
        address: '北京市朝阳区望京东路四号',
        zip: 200333,
        tag: '家',
      }, {
        date: '2016-05-02',
        name: '美小团',
        province: '北京',
        city: '朝阳区',
        address: '北京市朝阳区望京东路四号',
        zip: 200333,
        tag: '公司',
      }, {
        date: '2016-05-04',
        name: '美小团',
        province: '北京',
        city: '朝阳区',
        address: '北京市朝阳区望京东路四号',
        zip: 200333,
        tag: '家',
      }, {
        date: '2016-05-01',
        name: '美小团',
        province: '北京',
        city: '朝阳区',
        address: '北京市朝阳区望京东路四号',
        zip: 200333,
        tag: '公司',
      }],
    };
  },
};
</script>
