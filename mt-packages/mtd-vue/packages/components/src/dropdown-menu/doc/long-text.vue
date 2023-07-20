<template>
  <div>
    <mtd-dropdown popper-class="long-text-demo">
      <mtd-button type="text-primary">
        <span style="margin-right: 4px;">田家园日</span>
        <i class="mtdicon mtdicon-down" />
      </mtd-button>
      <mtd-dropdown-menu slot="dropdown" >
        <mtd-dropdown-menu-item>
          <mtd-tooltip content="昨夜斗回北，今朝岁起东。" placement="top" >
            <div class="verse">昨夜斗回北，今朝岁起东。</div>
          </mtd-tooltip>
        </mtd-dropdown-menu-item>

        <mtd-dropdown-menu-item>
          <mtd-tooltip content="我年已强仕，无禄尚忧农。" placement="top" >
            <div class="verse">我年已强仕，无禄尚忧农。</div>
          </mtd-tooltip>
        </mtd-dropdown-menu-item>

        <mtd-dropdown-menu-item>
          <mtd-tooltip content="桑野就耕父，荷锄随牧童。" placement="top" >
            <div class="verse">桑野就耕父，荷锄随牧童。</div>
          </mtd-tooltip>
        </mtd-dropdown-menu-item>

        <mtd-dropdown-menu-item>
          <mtd-tooltip content="田家占气候，共说此年丰。" placement="top" >
            <div class="verse">田家占气候，共说此年丰。</div>
          </mtd-tooltip>
        </mtd-dropdown-menu-item>
      </mtd-dropdown-menu>
    </mtd-dropdown>
  </div>
</template>

<style>

.long-text-demo .verse{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 150px;
}

</style>
