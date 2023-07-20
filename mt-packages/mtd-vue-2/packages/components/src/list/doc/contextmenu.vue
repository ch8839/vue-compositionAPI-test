<template>
  <mtd-list size="large">
    <mtd-list-item
      v-for="(item, index) in data"
      :key="index">
      <mtd-contextmenu style="cursor: pointer;" :options="[
      {
        label: '编辑',
        handle: () => handleToggle(index),
      },
      {
        label: '删除',
        handle: () => handleRemove(index),
      },
    ]">
      <div class="demo-content" style="align-items:center;">
        <img class="demo-content-avatar" :src="item.avatar">
        <div class="demo-content-main">
          <div class="demo-content-title" v-show="!item.isEdit">{{ item.title }}</div>
          <mtd-input class="demo-content-title" size="small" v-show="item.isEdit"/>
        </div>
        <i :class="`mtdicon-${item.isEdit ? 'success' : 'edit'}-o demo-editable`" @click="handleToggle(index)" />
      </div>
      </mtd-contextmenu>
    </mtd-list-item>
  </mtd-list>
</template>
<script>
export default {
  data () {
    return {
      editable: false,
      data: [
        {
          title: 'lilu01',
          description: '企业产品设计中心-基础研发产品设计组',
          extra: '2018.02.45',
          isEdit: false,
          avatar: require('./avatar.png'),
        },
        {
          title: 'lilu02',
          description: '企业产品设计中心-基础研发产品设计组',
          extra: '2018.02.45',
          isEdit: false,
          avatar: require('./avatar.png'),
        },
        {
          title: 'lilu03',
          description: '企业产品设计中心-基础研发产品设计组',
          extra: '2018.02.45',
          isEdit: false,
          avatar: require('./avatar.png'),
        },
      ],
      contextmenu: []
    };
  },
  created() {
  },
  methods: {
    handleToggle (index) {
      this.$set(this.data[index], 'isEdit', !this.data[index].isEdit);
    },
    handleRemove (index) {
      this.data.splice(index,1)
    }
  },
};
</script>
