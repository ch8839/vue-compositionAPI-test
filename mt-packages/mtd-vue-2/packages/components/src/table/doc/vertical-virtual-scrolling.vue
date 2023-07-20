<template>
  <div class="demo-full-width">
    <mtd-table 
      :data="tableData" 
      :height="300" 
      :virtual-options="virtualOptions" 
      vertical-virtual
      >
      <mtd-table-column
        prop="date"
        label="日期"
        width="180" />
      <mtd-table-column
        prop="name"
        label="姓名"
        width="150" />
      <mtd-table-column
        prop="address"
        label="地址" />
    </mtd-table>
  </div>
</template>

<script>

const originData = [{
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
  }]
export default {
  data () {
    return {
      tableData: [],
      virtualOptions: {
        rowHeight: 36
      }
    };
  },

  created() {
    let n = 25;
    for(;n > 0;n--){
      this.tableData.push(...originData)
    }
  }
};
</script>
