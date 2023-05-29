<template>
  <div class="demo-full-width">
    <mtd-list>
      <mtd-list-item-group header="大数据小组">
        <mtd-list-item
          v-for="(item, index) in data"
          :key="index">
          <div class="demo-content">
            <img class="demo-content-avatar" :src="item.avatar">
            <div class="demo-content-main">
              <div class="demo-content-title">{{ item.title }}</div>
              <div class="demo-content-description">{{ item.description }}</div>
            </div>
            <div class="demo-extra">{{ item.extra }}</div>
          </div>
        </mtd-list-item>
      </mtd-list-item-group>
      <mtd-list-item-group header="大中台小组">
        <mtd-list-item
          v-for="(item, index) in data"
          :key="index">
          <div class="demo-content">
            <img class="demo-content-avatar" :src="item.avatar">
            <div class="demo-content-main">
              <div class="demo-content-title">{{ item.title }}</div>
              <div class="demo-content-description">{{ item.description }}</div>
            </div>
            <div class="demo-extra">{{ item.extra }}</div>
          </div>
        </mtd-list-item>
      </mtd-list-item-group>
    </mtd-list>
  </div>
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
};
</script>
