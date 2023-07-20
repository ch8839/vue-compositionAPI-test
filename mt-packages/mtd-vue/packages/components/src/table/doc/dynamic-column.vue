<template>
  <div>
    <mtd-dropdown style="float: right; margin-bottom: 8px;">
      <mtd-icon-button icon="filter-o" />
      <mtd-checkbox-group class="demo-checkbox-group" v-model="columns" slot="dropdown">
        <mtd-checkbox value="number">number</mtd-checkbox>
        <mtd-checkbox value="name">name</mtd-checkbox>
        <mtd-checkbox value="address">address</mtd-checkbox>
        <mtd-checkbox value="tag">tag</mtd-checkbox>
      </mtd-checkbox-group>
    </mtd-dropdown>
    <mtd-table :data="tableData"
      style="margin-bottom: 20px;"
      row-key="number"
      :selection="selection"
      reserve-selection
      :index-of-selection="indexOfSelection"
      height="500px">
      <mtd-table-column
        type="selection"
        width="42" />
      <mtd-table-column v-for="column in columns" :key="column"
        :prop="column" :label="column" />
    </mtd-table>
  </div>
</template>
<script>
export default {
  name: 'DemoReserveSelection',
  data () {
    return {
      columns: [],
      selection: [],
      currentPage: 1,
      tableData: this.getTableData(1),
    };
  },
  watch: {
    currentPage (n) {
      this.tableData = this.getTableData(n);
    },
  },
  methods: {
    indexOfSelection (row, selection) {
      return selection.map((s) => s.number).indexOf(row.number);
    },
    getTableData (page) {
      const data = [];
      const tags = ['家', '公司', '地铁'];
      for (let i = 0; i < 20; i++) {
        data.push({
          number: `${page}-${i}`,
          name: '美小团',
          province: '北京',
          city: '朝阳区',
          address: '北京市朝阳区望京东路四号',
          zip: 200333 + i,
          tag: tags[i % tags.length],
        });
      }
      return data;
    },
  },
};
</script>
<style lang="scss">
  .demo-checkbox-group {
    .mtd-checkbox {
      display: block;
    }
  }
</style>
