<template>
  <div class="demo-full-width">
    <mtd-table :data="tableData" horizontal-virtual bordered>
      <mtd-table-column v-for="(column,index) in columns"
        :prop="column.prop"
        :label="column.label + '_' + index"
        :width="column.width" 
        :key="index"
        :fixed="index < 3"
      />
    </mtd-table>
  </div>
</template>

<script>

const columnsData = [
  {
    prop: 'date',
    label: '日期',
    width: '200',
  },
  {
    prop: 'name',
    label: '姓名',
    width: '100',
  },
  {
    prop: 'province',
    label: '省份',
    width: '150',
  },
  {
    prop: 'city',
    label: '城市/区域',
    width: '250',
  },
  {
    prop: 'address',
    label: '地址',
    width: '300',
  },
  {
    prop: 'zip',
    label: '邮编',
    width: '150',
  },
  {
    prop: 'tag',
    label: '标签',
    width: '100',
  },
]

export default {
  data () {
    return {
      columns: [],

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
      },{
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

  created() {
    let n = 10;
    for(;n > 0;n--){
      this.columns.push(...columnsData)
    }
  },
};
</script>
