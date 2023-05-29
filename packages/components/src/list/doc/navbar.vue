<template>
  <mtd-list size="large">
    <mtd-list-item
      v-for="(item, index) in data"
      :key="index"
      @click.native="handleClick">
      <div class="demo-content">
        <mtd-badge style="padding: 2px;" :value="2" :max="99">
          <img class="demo-content-avatar" :src="item.avatar">
        </mtd-badge>
        <div class="demo-content-main">
          <div class="demo-content-title">{{ item.title }}</div>
          <div class="demo-content-description">{{ item.description }}</div>
        </div>
        <div class="demo-extra">{{ item.extra }}</div>
      </div>
    </mtd-list-item>
  </mtd-list>
</template>
<script>
export default {
  data () {
    return {
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
    handleClick () {
      this.$router.push('/components/button');
    },
  },
};
</script>
