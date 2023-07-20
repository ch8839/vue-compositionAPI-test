<template>
  <div class="demo-box">
    <mtd-card class="card-box" body-class="card-body-cover">
      <mtd-list>
        <mtd-list-item
          v-for="(item, index) in data"
          :key="index">
          <div class="demo-content">
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
</template>

<script>
export default {
  data () {
    return {
      data: [
        {
          title: '餐费支出',
          description: '',
          extra: '共计 ￥970',
          isEdit: false,
        },
        {
          title: '油焖大虾',
          description: '编号 021230',
          extra: '2018.02.45',
          isEdit: false,
        },
        {
          title: '拔丝地瓜',
          description: '编号 021230',
          extra: '2018.02.45',
          isEdit: false,
        },
        {
          title: '糖醋排骨',
          description: '编号 021230',
          extra: '2018.02.45',
          isEdit: false,
        },
        {
          title: '小鸡炖蘑菇',
          description: '编号 021230',
          extra: '2018.02.45',
          isEdit: false,
        },
      ],
    };
  },
};
</script>

<style lang="scss">

  .card-body-cover{
    padding: 0px;
  }
  .card-box {
    width: 400px;
    text-align: left;
    .mtd-list{
      border: none;
    }
    .demo-content {
      display: flex;
      align-items: center;
    }
    .demo-content-main {
      flex: 1 0;
      margin-left: 16px;
    }
    .demo-more {
      text-align: center;
      margin: 9px 0;
      cursor: pointer;
      color: #4E73FF;
    }
    .demo-content-title {
      font-weight:500;
      color: #464646;
      font-size: 16px;
    }
    .demo-content-description {
      font-size: 12px;
      color: #ADADAD;
    }
    .demo-extra {
      font-size: 12px;
      color: #ADADAD;
    }
  }

</style>
