<template>
  <div class="demo-full-width">
    <mtd-table
      :data="tableData3"
      :checkboxable="checkboxable"
      :selection="selection">
      <mtd-table-column
        type="selection"
        width="42">
        <template #selection="scope">
          <mtd-tooltip content="禁用项提示信息" :disabled="!scope.props.disabled">
            <mtd-checkbox v-bind="scope.props" v-on="scope.on" />
          </mtd-tooltip>
        </template>
      </mtd-table-column>
      <mtd-table-column
        label="日期"
        width="120">
        <template #default="scope">{{ scope.row.date }}</template>
      </mtd-table-column>
      <mtd-table-column
        prop="name"
        label="姓名"
        width="120" />
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
      tableData3: [{
        date: '2016-05-03',
        name: '美小团',
        address: '北京市朝阳区望京东路四号',
      }, {
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
        date: '2016-05-08',
        name: '美小团',
        address: '北京市朝阳区望京东路四号',
      }, {
        date: '2016-05-06',
        name: '美小团',
        address: '北京市朝阳区望京东路四号',
      }, {
        date: '2016-05-07',
        name: '美小团',
        address: '北京市朝阳区望京东路四号',
      }],
      checked: false,
      selection: [],
    }
  },

  methods: {
    checkboxable (row, index) {
      if (index < 3) {
        return false
      } else {
        return true
      }
    },
  },
}
</script>
