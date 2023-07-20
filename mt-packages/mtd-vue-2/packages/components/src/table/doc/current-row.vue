<template>
<div>
  <mtd-table
    :data="tableData6"
    highlight-current-row>
    <mtd-table-column
      prop="id"
      label="ID"
      width="180" />
    <mtd-table-column
      prop="name"
      label="姓名" />
    <mtd-table-column
      prop="amount1"
      label="数值 1（元）" />
    <mtd-table-column
      prop="amount2"
      label="数值 2（元）" />
    <mtd-table-column
      prop="amount3"
      label="数值 3（元）" />
  </mtd-table>
</div>
</template>
<script>
export default {
  data () {
    return {
      tableData6: [{
        id: '12987122',
        name: '美小团',
        amount1: '234',
        amount2: '3.2',
        amount3: 10,
      }, {
        id: '12987123',
        name: '美小团',
        amount1: '165',
        amount2: '4.43',
        amount3: 12,
      }, {
        id: '12987124',
        name: '美小团',
        amount1: '324',
        amount2: '1.9',
        amount3: 9,
      }, {
        id: '12987125',
        name: '美小团',
        amount1: '621',
        amount2: '2.2',
        amount3: 17,
      }, {
        id: '12987126',
        name: '美小团',
        amount1: '539',
        amount2: '4.1',
        amount3: 15,
      }],
    };
  },
  methods: {
  },
};
</script>
