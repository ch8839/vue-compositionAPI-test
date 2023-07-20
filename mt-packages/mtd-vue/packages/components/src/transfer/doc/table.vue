<template>
  <mtd-transfer
    :data="tansferDataSource"
    @change="onTransferChange"
    disableSelectAll="all"
    class="transfer-table-container-transfer"
    :props="{key : 'name'}"
    v-model="checkedData" >
    <template #children="{ 
          filteredData,
          direction,
          selectedKeys,
          onItemSelect }"
      >

      <!-- 左表格 -->
      <div class="transfer-table-container" v-show="direction === 'left'">
        <mtd-table
          height="300"
          :data="tableDataSource"
          :checkboxable="judgeDisabled('left')"
          :selection="selectionTableSource"
          @update:selection="(keys) => {
            handleSelect(keys,onItemSelect)
          }"
          >
          <mtd-table-column
            type="selection"
            width="40" />
          <mtd-table-column
            prop="age"
            label="年龄"
            width="60"/>
          <mtd-table-column
            prop="name"
            label="姓名"/>
        </mtd-table>
      </div>
      
      <!-- 右表格 -->
      <div class="transfer-table-container" v-show="direction === 'right'">
        <mtd-table
          height="300"
          :data="tableDataTarget"
          :checkboxable="judgeDisabled('right')"
          :selection="selectionTableTarget"
          @update:selection="(keys) => {
            handleSelect(keys,onItemSelect)
          }"
          >
          <mtd-table-column
            type="selection"
            width="40" />
          <mtd-table-column
            prop="age"
            label="年龄"
            width="60"/>
          <mtd-table-column
            prop="name"
            label="姓名"/>
        </mtd-table>
      </div>
    </template>
  </mtd-transfer>
</template>
<script>
export default {
  data () {
    return {
      checkedData: [],

      tansferDataSource: [],

      selectionTableSource: [],
      selectionTableTarget: [],
    };
  },

  created() {
    const originData =[{
        age: '24',
        name: '小明',
      }, {
        age: '25',
        name: '小张',
      }, {
        age: '19',
        name: '小宇',
      }, {
        age: '20',
        name: '美小团',
      }, {
        age: '23',
        name: '小红',
      }, {
        age: '30',
        name: '小李',
      }, {
        age: '22',
        name: '小丽',
      }, {
        age: '22',
        name: '欧阳东方',
      }, {
        age: '34',
        name: '小王',
      }, {
        age: '32',
        name: '大壮',
      }, {
        age: '30',
        name: '小美',
      }]

    this.tansferDataSource = originData
  },

  computed: {
    tableDataSource() {
      return this.tansferDataSource.filter(item => this.checkedData.indexOf(item.name) < 0)
    },

    tableDataTarget() {
      return this.tansferDataSource.filter(item => this.checkedData.indexOf(item.name) >= 0)
    },
  },

  methods: {
    handleSelect(items,cb) {
      const selectedKeys = items.map(item => item.name)
      cb(selectedKeys,cb)
    },

    onTransferChange()  {
      this.handleReset()
    },
    handleReset() {
      this.selectionTableSource = []
      this.selectionTableTarget = []
    },

    judgeDisabled(side) {
      return function(side) {
        return true
      }
    }
  }
};
</script>
<style>

.transfer-table-container{
  width: 100%;
  padding: 0 16px;
}

.transfer-table-container-transfer .mtd-transfer-panel{
  width:300px;
}

</style>