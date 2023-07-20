<template>
  <div class="demo-full-width">
    <p>折叠内容为表格</p>
    <mtd-table
      class="expandsTable"
      :data="tableData5"
      :row-key="getRowKeys"
      :expandable="expandable"
      :expand-row-keys="expands">
      <mtd-table-column type="expand" width="40">
        <template slot-scope="props">
          <mtd-table :data="tableData" :show-header="false">
            <mtd-table-column width="40" />
            <mtd-table-column
              prop="date"
              align="center"
              label="日期"
              width="180" />
            <mtd-table-column
              prop="name"
              label="姓名"
              width="180" />
            <mtd-table-column
              prop="address"
              label="地址" />
          </mtd-table>
        </template>
      </mtd-table-column>
      <mtd-table-column
        label="商品 ID"
        prop="id"
        width="180" />
      <mtd-table-column
        label="商品名称"
        prop="name"
        width="180" />
      <mtd-table-column
        label="描述"
        prop="desc" />
    </mtd-table>
  </div>
</template>
<script>
export default {
  data () {
    return {
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
      }],
      tableData5: [{
        id: '12987122',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '北京市朝阳区真北路',
        shop: '美小团夫妻店',
        shopId: '10333',
      }, {
        id: '12987123',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '北京市朝阳区真北路',
        shop: '美小团夫妻店',
        shopId: '10333',
      }, {
        id: '12987125',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '北京市朝阳区真北路',
        shop: '美小团夫妻店',
        shopId: '10333',
      }, {
        id: '12987126',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '北京市朝阳区真北路',
        shop: '美小团夫妻店',
        shopId: '10333',
      }],

      // 要展开的行，数值的元素是row的key值
      expands: [],
    };
  },
  methods: {
    // 获取row的key值
    getRowKeys (row) {
      return row.id;
    },
    expandable (row, index) {
      return index > 0;
    },
  },
};
</script>

<style>
  .expandsTable .mtd-table-expanded-cell td {
    /* padding: 10px 0px 10px 40px; */
    background-color: rgba(0,0,0,0.02);
  }
</style>
