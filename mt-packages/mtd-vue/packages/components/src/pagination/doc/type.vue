<template>
<div class="demo-full-width" style="text-align: left;">
  <div style="display: inline-block; margin-bottom: 20px; ">
    <p>标准线框型</p>
    <mtd-pagination
      :total="60"
      :current-page.sync="currentPage1" />
  </div><br><br>
  <div style="display: inline-block; margin-bottom: 20px; ">
    <p>标准填充型</p>
    <mtd-pagination
      fullfill
      :total="60"
      :current-page.sync="currentPage2" />
  </div><br><br>
  <div style="display: inline-block; margin-bottom: 20px;">
    <p>无边框型</p>
    <mtd-pagination
      unborder
      :total="60"
      :current-page.sync="currentPage3" />
  </div><br><br>
  <div style="display: inline-block;" >
    <p>简洁型</p>
    <mtd-pagination
      simple
      :total="60"
      :current-page.sync="currentPage4" />
  </div>
</div>
</template>
<script>
export default {
  data () {
    return {
      currentPage1: 1,
      currentPage2: 1,
      currentPage3: 1,
      currentPage4: 1,
    };
  },
};
</script>
