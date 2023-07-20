<template>
  <div class="demo-full-width">
    <mtd-row>
      <mtd-col :span="20">
        <mtd-table 
          :data="tableData"
          style="margin-bottom: 20px;"
          row-key="number"
          :selection="selection"
          reserve-selection
          :index-of-selection="indexOfSelection"
          height="500px">
          <mtd-table-column type="expand" width="40">
            <template #default="props">
              <div style="line-height: 36px;padding-left:20px;width:100%;background-color:rgba(0,0,0,0.02)">hello world</div>
            </template>
          </mtd-table-column>
          <mtd-table-column
            type="selection"
            width="42" />
          <mtd-table-column
            prop="number"
            label="编号"
            width="60" />
          <mtd-table-column
            prop="name"
            label="姓名"
            width="180" />
          <mtd-table-column
            prop="address"
            label="地址" />
          <mtd-table-column
            prop="tag"
            label="标签"
            width="60" />
        </mtd-table>
        <mtd-pagination
          :total="200"
          :show-total="false"
          :current-page.sync="currentPage"
          v-model:current-page="currentPage"
          style="float: right;" />
      </mtd-col>
      <mtd-col :span="4" style="text-align: left; padding: 0px 8px;">
        当前选中:<br>
        <mtd-tag v-for="item in selection" :key="item.number" style="margin-right: 4px;margin-bottom: 4px;">
          {{ item.number }}
        </mtd-tag>
      </mtd-col>
    </mtd-row>
  </div>
</template>
<script>
export default {
  name: 'DemoReserveSelection',
  data () {
    return {
      selection: [],
      currentPage: 1,
      tableData: this.getTableData(1),
    }
  },
  watch: {
    currentPage (n) {
      this.tableData = this.getTableData(n)
    },
  },
  methods: {
    indexOfSelection (row, selection) {
      return selection.map((s) => s.number).indexOf(row.number)
    },
    getTableData (page) {
      const data = []
      const tags = ['家', '公司', '地铁']
      for (let i = 0; i < 20; i++) {
        data.push({
          number: `${page}-${i}`,
          name: '美小团',
          province: '北京',
          city: '朝阳区',
          address: '北京市朝阳区望京东路四号',
          zip: 200333 + i,
          tag: tags[i % tags.length],
        })
      }
      return data
    },
  },
}
</script>
