<template>
  <mtd-list size="normal">
    <mtd-list-item
      v-for="(item, index) in data"
      :key="index">
      <div class="demo-content">
        <img class="demo-content-avatar" :src="item.avatar">
        <div class="demo-content-username" >{{'user ' + index}}</div>
      </div>
    </mtd-list-item>
  </mtd-list>
</template>
<script>
export default {
  data () {
    return {
      editable: false,
      loading: false,
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
};
</script>
