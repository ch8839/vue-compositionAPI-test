<template>
  <div>
    <mtd-popover title="标题" trigger="hover" size="large" placement="top">
      <mtd-button style="margin-right: 40px;">
        大号
      </mtd-button>
      <template #content>
        <div class="demo-popover-content">
          明月几时有，把酒问青天。不知天上宫阙，今夕是何年。
        </div>
      </template>
    </mtd-popover>
    <mtd-popover title="标题" trigger="hover" placement="top">
      <mtd-button>
        默认
      </mtd-button>
      <template #content>
        <div class="demo-popover-content">
          明月几时有，把酒问青天。不知天上宫阙，今夕是何年。
        </div>
      </template>
    </mtd-popover>
  </div>
</template>
