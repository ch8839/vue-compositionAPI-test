<template>
  <mtd-table :data="tableData" style="width: 400px;">
    <mtd-table-column
      prop="date"
      label="日期"
      width="180"
      sortable
      fixed="left"
      :filters="[
        { text: '2016-05-02', value: '2016-05-02' },
        { text: '2016-05-03', value: '2016-05-03' },
        { text: '2016-05-04', value: '2016-05-04' },
      ]"
      :filter-method="filterDate" />
    <mtd-table-column
      prop="name"
      label="姓名"
      width="180"
      sortable
      :filters="[
        { text: '小美', value: '小美' },
        { text: '小团', value: '小团' },
        { text: '小小', value: '小小' },
      ]"
      :filter-method="filterName" />
    <mtd-table-column
      fixed="right"
      prop="address"
      label="地址" />
  </mtd-table>
</template>
<script>
export default {
  data () {
    return {
      tableData: [{
        date: '2016-05-03',
        name: '小团',
        province: '北京',
        city: '朝阳区',
        address: '北京市朝阳区望京东路四号',
        zip: 200333,
        tag: '家',
      }, {
        date: '2016-05-02',
        name: '小美',
        province: '北京',
        city: '朝阳区',
        address: '北京市朝阳区望京东路四号',
        zip: 200333,
        tag: '公司',
      }, {
        date: '2016-05-04',
        name: '小小',
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
  methods: {
    filterDate (value, row) {
      return value === row.date;
    },
    filterName (value, row) {
      return value === row.name;
    },
  },
};
</script>
