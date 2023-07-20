<template>
  <div class="demo-full-width" style="text-align: right;">
    <mtd-table :data="tableData"
      style="margin-bottom: 20px;">
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
      <h1 slot="empty">123</h1>
    </mtd-table>
    <mtd-pagination
      size="small"
      :total="60"
      :show-total="false"
      :current-page.sync="currentPage" />
  </div>
</template>
<script>
export default {
  data () {
    return {
      currentPage: 1,
      selection: [],
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
