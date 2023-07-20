<template>
  <div class="demo-full-width">
    <mtd-table
      :data="tableData3"
      :checkboxable="checkboxable"
      :selection="selection">
      <mtd-table-column
        type="selection"
        width="60" />
      <mtd-table-column
        label="日期"
        width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </mtd-table-column>
      <mtd-table-column
        prop="name"
        label="姓名"
        width="120" />
      <mtd-table-column
        prop="address"
        label="地址" />
    </mtd-table>
    <div style="margin-top: 20px">
      <mtd-button @click="selectRow()">选中第三、第四行</mtd-button>
      <mtd-button @click="clearSelectRow()">取消选择</mtd-button>
    </div>
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
    };
  },

  methods: {
    selectRow () {
      const {tableData3, selection} = this;
      const rows = [tableData3[2], tableData3[3]];
      rows.forEach((row) => {
        if (selection.indexOf(row) === -1) {
          selection.push(row);
        }
      });
    },
    clearSelectRow () {
      this.selection = [];
    },
    checkboxable (row, index) {
      if (index === 1) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>
