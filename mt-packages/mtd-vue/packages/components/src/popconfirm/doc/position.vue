<template>
  <div class="box">
    <div class="top">
      <mtd-popconfirm
        class="item"
        message="Top Left 提示文字"
        placement="top-start"
      >
        <mtd-button>上左</mtd-button>
      </mtd-popconfirm>
      <mtd-popconfirm
        class="item"
        message="Top Center 提示文字"
        placement="top"
      >
        <mtd-button>上边</mtd-button>
      </mtd-popconfirm>
      <mtd-popconfirm
        class="item"
        message="Top Right 提示文字"
        placement="top-end"
      >
        <mtd-button>上右</mtd-button>
      </mtd-popconfirm>
    </div>
    <div class="left">
      <mtd-popconfirm
        class="item"
        message="Left Top 提示文字"
        placement="left-start"
      >
        <mtd-button>左上</mtd-button>
      </mtd-popconfirm>
      <mtd-popconfirm
        class="item"
        message="Left Center 提示文字"
        placement="left"
      >
        <mtd-button>左边</mtd-button>
      </mtd-popconfirm>
      <mtd-popconfirm
        class="item"
        message="Left Bottom 提示文字"
        placement="left-end"
      >
        <mtd-button>左下</mtd-button>
      </mtd-popconfirm>
    </div>
    <div class="right">
      <mtd-popconfirm
        class="item"
        message="Right Top 提示文字"
        placement="right-start"
      >
        <mtd-button>右上</mtd-button>
      </mtd-popconfirm>
      <mtd-popconfirm
        class="item"
        message="Right Center 提示文字"
        placement="right"
      >
        <mtd-button>右边</mtd-button>
      </mtd-popconfirm>
      <mtd-popconfirm
        class="item"
        message="Right Bottom 提示文字"
        placement="right-end"
      >
        <mtd-button>右下</mtd-button>
      </mtd-popconfirm>
    </div>
    <div class="bottom">
      <mtd-popconfirm
        class="item"
        message="Bottom Left 提示文字"
        placement="bottom-start"
      >
        <mtd-button>下左</mtd-button>
      </mtd-popconfirm>
      <mtd-popconfirm
        class="item"
        message="Bottom Center 提示文字"
        placement="bottom"
      >
        <mtd-button>下边</mtd-button>
      </mtd-popconfirm>
      <mtd-popconfirm
        class="item"
        message="Bottom Right 提示文字"
        placement="bottom-end"
      >
        <mtd-button>下右</mtd-button>
      </mtd-popconfirm>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.box {
  width: 500px;
  margin: 0 auto;
  .top {
    text-align: center;
  }

  .left {
    float: left;
    width: 60px;
  }

  .right {
    float: right;
    width: 60px;
  }

  .bottom {
    clear: both;
    text-align: center;
  }

  .item {
    margin: 4px;
    display: inline-block;
  }

  .left .mtd-popover-rel,
  .right .mtd-popover-rel {
    padding: 8px 10px;
  }
}
</style>
