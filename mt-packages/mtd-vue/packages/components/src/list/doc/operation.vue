<template>
  <mtd-list size="large">
    <mtd-list-item
      v-for="(item, index) in data"
      :key="index">
      <div class="demo-content" style="align-items:center;">
        <img class="demo-content-avatar" :src="item.avatar">
        <div class="demo-content-main">
          <div class="demo-content-title" v-show="!item.isEdit">{{ item.title }}</div>
          <mtd-input class="demo-content-title" size="small" v-show="item.isEdit"/>
        </div>
        <i :class="`mtdicon-${item.isEdit ? 'success' : 'edit'}-o demo-editable`" @click="handleToggle(index)" />
      </div>
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
          title: 'lilu06',
          description: '企业产品设计中心-基础研发产品设计组',
          extra: '2018.02.45',
          isEdit: false,
          avatar: require('./avatar.png'),
        },
        {
          title: 'lilu06',
          description: '企业产品设计中心-基础研发产品设计组',
          extra: '2018.02.45',
          isEdit: false,
          avatar: require('./avatar.png'),
        },
        {
          title: 'lilu06',
          description: '企业产品设计中心-基础研发产品设计组',
          extra: '2018.02.45',
          isEdit: false,
          avatar: require('./avatar.png'),
        },
      ],
    };
  },
  methods: {
    handleToggle (index) {
      this.$set(this.data[index], 'isEdit', !this.data[index].isEdit);
    },
  },
};
</script>
