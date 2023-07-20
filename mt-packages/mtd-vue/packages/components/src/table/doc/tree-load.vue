<template>
<mtd-table :data="tableData" tree
  :expand-row-keys.sync="expands"
  row-key="id"
  :load-data="loadData">
  <mtd-table-column
    prop="id"
    label="工单号"
    sortable
    :filters="[
      { text: '243304314806', value: '243304314806' },
      { text: '243304314807', value: '243304314807' },
      { text: '243304314809', value: '243304314809' },
    ]"
    :filter-method="filterName" />
  <mtd-table-column
    prop="status"
    label="状态"
    width="100" />
  <mtd-table-column
    prop="author"
    label="申请人"
    width="100" />
  <mtd-table-column
    prop="email"
    label="邮箱"
    width="220" />
</mtd-table>
</template>
<script>
export default {
  data () {
    return {
      expands: ['243304314807'],
      tableData: [{
        id: '243304314806',
        status: '待审核',
        author: '白居易',
        email: 'baijuyi@meituan.com',
      }, {
        id: '243304314807',
        status: '已通过',
        author: '王维',
        email: 'wangwei@meituan.com',
        children: [{
          id: '243304314807-1',
          status: '已通过',
          author: '王维',
          email: 'wangwei@meituan.com',
          children: [{
            id: '243304314807-1-1',
            status: '已通过',
            author: '王维',
            email: 'wangwei@meituan.com',
          }, {
            id: '243304314807-1-2',
            status: '已通过',
            author: '王维',
            email: 'wangwei@meituan.com',
          }],
        }, {
          id: '243304314807-2',
          status: '已通过',
          author: '王维',
          email: 'wangwei@meituan.com',
        }, {
          id: '243304314807-3',
          status: '已通过',
          author: '王维',
          email: 'wangwei@meituan.com',
        }],
      }, {
        id: '243304314808',
        status: '已通过',
        author: '王维',
        email: 'wangwei@meituan.com',
      }, {
        id: '243304314809',
        status: '已通过',
        author: '陶渊明',
        email: 'taoyuanmming@meituan.com',
        children: [{
          id: '243304314809-1',
          status: '已通过',
          author: '王维',
          email: 'wangwei@meituan.com',
        }, {
          id: '243304314809-2',
          status: '已驳回',
          author: '陶渊明',
          email: 'taoyuanmming@meituan.com',
        }],
      }],
    };
  },
  methods: {
    filterName (value, row) {
      return value === row.id;
    },
    loadData (row, callback) {
      const { id } = row;
      setTimeout(() => {
        callback([{
          id: `${id}-1`,
          status: '已通过',
          author: '王维',
          email: 'wangwei@meituan.com',
          isLeaf: true,
        }, {
          id: `${id}-2`,
          status: '已通过',
          author: '王维',
          email: 'wangwei@meituan.com',
          isLeaf: true,
        }]);
      }, 2000);
    },
  },
};
</script>
