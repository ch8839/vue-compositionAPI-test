<template>
  <div>
    <div @click="toggleExpended" class="demo-collapse-poem" style="margin-bottom:4px"
      :class="{ 'expended': expended }">
      通知中心 <i style="color: #D3D8E4" class="mtdicon mtdicon-down" />
    </div>
    <mtd-collapse-transition>
      <div v-show="expended">
        <mtd-card  style="width: 500px;margin: 0 auto" class="demo-card-list">
          <mtd-list :split="false">
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
          </mtd-list>
        </mtd-card>
      </div>
    </mtd-collapse-transition>
  </div>
</template>
<script>
export default {
  data () {
    return {
      expended: false,
      data: new Array(5).fill({
          title: 'lilu06',
          description: '企业产品设计中心-基础研发产品设计组',
          extra: '2018.02.45',
          isEdit: false,
          avatar: require('./avatar.png'),
        }),
    };
  },
  methods: {
    toggleExpended () {
      this.expended = !this.expended;
    },
  },
};
</script>
<style lang='scss'>
  .demo-collapse-poem {
    cursor: pointer;

    .mtdicon-down {
      transition: transform .3s;
      transform: rotate(0deg);
    }

    &.expended {
      .mtdicon-down {
        transform: rotate(180deg);
      }
    }
  }

  .demo-card-list {
    .mtd-card-body {
      padding: 4px;

    }
    .mtd-list {
      border: none;
    }
    .mtd-list-item{
      border-radius: 4px;
    }
  }
</style>
