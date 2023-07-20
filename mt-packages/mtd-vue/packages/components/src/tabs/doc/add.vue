<template>
  <div class="demo-full-width">
    <mtd-tabs
      v-model="activeName9"
      addable
      closable
      type="border-card"
      @tab-click="handleClick9"
      @tab-add="tabAdd9"
      @tab-remove="tabRemove9"
    >
      <mtd-tab-pane
        v-for="item in tabsCardList9"
        :label="item.label"
        :value="item.value"
        :key="item.value"
      >
        {{ item.panel }}
      </mtd-tab-pane>
    </mtd-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName9: 'Tab1',
      tabsCardList9: [
        {
          label: 'Tab1',
          value: 'Tab1',
          panel: '标签页1的示例内容',
        },
        {
          label: 'Tab2',
          value: 'Tab2',
          panel: '标签页2的示例内容',
        },
        {
          label: `Tab3 It's a long title so we're going to leave it out`,
          value: 'Tab3',
          panel: '标签页3的示例内容',
        },
        {
          label: 'Tab4',
          value: 'Tab4',
          panel: '标签页4的示例内容',
        },
        {
          label: 'Tab5',
          value: 'Tab5',
          panel: '标签页5的示例内容',
        },
      ],
      tabCardIndex: 10,
    };
  },
  methods: {
    handleClick9() {},
    tabAdd9() {
      const tabName = 'Tab' + (this.tabsCardList9.length + 1);
      const tab = {
        label: tabName,
        value: tabName,
        panel: `${tabName}的示例内容`,
      };
      this.tabsCardList9.push(tab);
      this.activeName9 = tab.value;
    },
    tabRemove9(event, targetValue) {
      this.$nextTick(() => {
        const tabs = this.tabsCardList9;
        let activeName9 = this.activeName9;
        if (activeName9 === targetValue) {
          tabs.forEach((tab, index) => {
            if (tab.value === targetValue) {
              const nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName9 = nextTab.value;
              }
            }
          });
        }
        this.activeName9 = activeName9;
        this.tabsCardList9 = tabs.filter((tab) => tab.value !== targetValue);
      });
    },
  },
};
</script>
