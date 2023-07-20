<template>
  <mtd-table :data="tableData">
    <mtd-table-column
      label="日期"
      width="240">
      <template slot-scope="scope">
        <mtd-input v-model="scope.row.date" placeholder="具体文案" />
      </template>
    </mtd-table-column>
    <mtd-table-column
      label="姓名">
      <template slot-scope="scope">
        <mtd-popover trigger="hover" placement="top">
          <span>{{ scope.row.name }}</span>
          <div slot="content" class="name-wrapper">
            <mtd-tag size="small">{{ scope.row.name }}</mtd-tag>
          </div>
        </mtd-popover>
      </template>
    </mtd-table-column>
    <mtd-table-column label="操作" width="180">
      <template slot-scope="scope">
        <mtd-button
          size="small"
          type="text-primary"
          @click="handleEdit(scope.$index, scope.row)">通过
        </mtd-button>
        <mtd-button
          size="small"
          type="text-primary"
          @click="handleDelete(scope.$index, scope.row)">删除
        </mtd-button>
      </template>
    </mtd-table-column>
  </mtd-table>
</template>

<script>
export default {
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '美小团',
        address: '北京市朝阳区望京东路四号',
      }, {
        date: '2016-05-04',
        name: '美小团',
        address: '北京市朝阳区望京东路四号 1517 号',
      }, {
        date: '2016-05-01',
        name: '美小团',
        address: '北京市朝阳区望京东路四号 1519 号',
      }, {
        date: '2016-05-03',
        name: '美小团',
        address: '北京市朝阳区望京东路四号 1516 号',
      }],
    };
  },
  methods: {
    handleEdit (index, row) {
      console.log(index, row);
    },
    handleDelete (index, row) {
      console.log(index, row);
    },
  },
};
</script>
