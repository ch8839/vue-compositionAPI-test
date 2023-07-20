<template>
  <div class="table-content-container">
    <mtd-table
      :data="tableData3"
      bordered
      class="table-content"
    >
      <mtd-table-column
        width="150"
        key="1"
        prop="date"
        label="日期"
        sortable
        :filters="[
          { text: '2016-05-02', value: '2016-05-02' },
          { text: '2016-05-03', value: '2016-05-03' },
          { text: '2016-05-04', value: '2016-05-04' },
        ]"
        :filter-method="filterDate"
      />
      <mtd-table-column
        prop="name"
        key="2"
        label="姓名"
        width="100"
        sortable
      />
      <mtd-table-column
        prop="province"
        label="省份"
        key="3"
        width="150"
      />
      <mtd-table-column prop="city" label="市区" key="4" width="250" />
      <mtd-table-column prop="address" label="地址" key="5" width="250" />
      <mtd-table-column prop="zip" label="邮编" key="6" width="250" />
      <mtd-table-column fixed="right" key="7" label="操作" width="80">
        <template #default="scope">
          <mtd-button
            @click="handleClick(scope.row)"
            type="text-primary"
            size="small"
            >查看</mtd-button
          >
          <mtd-button type="text-primary" style="margin-left: 12px" size="small"
            >编辑</mtd-button
          >
        </template>
      </mtd-table-column>
    </mtd-table>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const tableData3 = [
  {
    date: "2016-05-03",
    name: "美小团",
    province: "北京",
    city: "朝阳区",
    address: "北京市朝阳区望京东路四号 1518",
    detailAddress: "望京东路四号",
    zip: 200333,
  },
  {
    date: "2016-05-02",
    name: "美小团",
    province: "北京",
    city: "朝阳区",
    address: "北京市朝阳区望京东路四号",
    detailAddress: "望京东路四号",
    zip: 200333,
  },
  {
    date: "2016-05-04",
    name: "美小团",
    province: "北京",
    city: "朝阳区",
    address: "北京市朝阳区望京东路四号",
    detailAddress: "望京东路四号",
    zip: 200333,
  },
  {
    date: "2016-05-01",
    name: "美小团",
    province: "北京",
    city: "朝阳区",
    address: "北京市朝阳区望京东路四号",
    detailAddress: "望京东路四号",
    zip: 200333,
  },
  {
    date: "2016-05-08",
    name: "美小团",
    province: "北京",
    city: "朝阳区",
    address: "北京市朝阳区望京东路四号",
    detailAddress: "望京东路四号",
    zip: 200333,
  },
  {
    date: "2016-05-06",
    name: "美小团",
    province: "北京",
    city: "朝阳区",
    address: "北京市朝阳区望京东路四号",
    detailAddress: "望京东路四号",
    zip: 200333,
  },
  {
    date: "2016-05-07",
    name: "美小团",
    province: "北京",
    city: "朝阳区",
    address: "北京市朝阳区望京东路四号",
    detailAddress: "望京东路四号",
    zip: 200333,
  },
];
// import { useRecoveryDataStore } from "../stores/recoveryContent";
// const dataStore = useRecoveryDataStore();
// const props = defineProps(["type"]);
// const { dataSource } = dataStore.tableList[props.type];

let currentPage = ref(1);
let pageSize = ref(50);
onMounted(() => {});

function handlePageChange(current, size) {
  currentPage.value = current;
  pageSize.value = size;
  console.log(
    "🚀🚀🚀🔊 ---> file: TableContent.vue:42 ---> current,size:",
    current,
    size
  );
}
function filterDate(value, row) {
  console.log(
    "🚀🚀🚀🔊 ---> file: TableContent.vue:80 ---> value, row):",
    value,
    row
  );
  return value === row.date;
}
function handleFilterChange(filtered) {
  console.log(
    "🚀🚀🚀🔊 ---> file: TableContent.vue:89 ---> filtered:",
    filtered
  );
  console.log("filtered:", filtered);
}
function filterName(value, row) {
  return value === row.name || row.name.indexOf(value) > -1;
}
</script>

<style lang="scss">
.table-content-container {
  margin-top: 21px;
  width: 800px;
  .table-content {
    width: 100%;
  }
  .table-pagination {
    padding-top: 25px;
    padding-bottom: 25px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
