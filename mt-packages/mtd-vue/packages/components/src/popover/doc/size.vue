<template>
  <div>
    <mtd-popover title="标题" trigger="hover" size="large" placement="top">
      <mtd-button style="margin-right: 40px;">
        大号
      </mtd-button>
      <div slot="content" class="demo-popover-content">
        明月几时有，把酒问青天。不知天上宫阙，今夕是何年。
      </div>
    </mtd-popover>
    <mtd-popover title="标题" trigger="hover" placement="top">
      <mtd-button>
        默认
      </mtd-button>
      <div slot="content" class="demo-popover-content">
        明月几时有，把酒问青天。不知天上宫阙，今夕是何年。
      </div>
    </mtd-popover>
  </div>
</template>
