<template>
  <mtd-table :data="tableData">
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
      label="地址" show-overflow-tooltip
      overflow-selector=".demo-text-ellipsis">
      <div slot-scope="scope">
        <div class="demo-text-ellipsis">{{ scope.row.address }}</div>
      </div>
    </mtd-table-column>
  </mtd-table>
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
        address: '北京市朝阳区望京东路四号北京市朝阳区望京东路四号北京市朝阳区望京东路四号北京市朝阳区望京东路四号',
        zip: 200333,
        tag: '家',
      }, {
        date: '2016-05-02',
        name: '美小团',
        province: '北京',
        city: '朝阳区',
        address: '北京市朝阳区望京东路四号北京市朝阳区望京东路四号北京市朝阳区望京东路四号北京市朝阳区望京东路四号',
        zip: 200333,
        tag: '公司',
      }, {
        date: '2016-05-04',
        name: '美小团',
        province: '北京',
        city: '朝阳区',
        address: '北京市朝阳区望京东路四号北京市朝阳区望京东路四号北京市朝阳区望京东路四号北京市朝阳区望京东路四号',
        zip: 200333,
        tag: '家',
      }, {
        date: '2016-05-01',
        name: '美小团',
        province: '北京',
        city: '朝阳区',
        address: '北京市朝阳区望京东路四号北京市朝阳区望京东路四号北京市朝阳区望京东路四号北京市朝阳区望京东路四号',
        zip: 200333,
        tag: '公司',
      }],
    };
  },
  methods: {
  },
};
</script>
<style lang="scss">
.demo-text-ellipsis{
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
