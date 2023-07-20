<template>
  <ul class="flat-component-list">
    <li class="flat-component-item" v-for="item in components" :key="item.path">
      <router-link :to="item.path" tag="div"
                   active-class="active-component">
        <div class="flat-component" @click="handleClick"
             :class="$route.name === item.name && 'component-active'">
          <div class="flat-bg" :class="`component-${item.name.toLowerCase()}`" />
          <div class="flat-text">
            <div v-if="!item.cnName">
              {{ item.name }}
            </div>
            <div class="double-line" v-else-if="doubleLine(item)">
              <span>{{ item.cnName }}</span>
              <div>{{ `/ ${item.name}` }}</div>
            </div>
            <div v-else>
              {{ `${item.cnName} / ${item.name}` }}
            </div>
          </div>
        </div>
     </router-link>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    navs: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    const components = this.navs.reduce((com, nav) => {
      com = com.concat(nav.list);
      return com;
    }, []);
    return {
      components,
    };
  },
  methods: {
    handleClick () {
      this.$emit('on-click');
    },
    doubleLine (item) {
      return (item.cnName.length === 2 && item.name.length >= 13) ||
        (item.cnName.length === 3 && item.name.length >= 9) ||
        (item.cnName.length === 4 && item.name.length >= 8) ||
        (item.cnName.length > 4);
    },
  },
};
</script>
<style lang="scss">
$component-name: (badge, breadcrumb, button, checkbox,
  collapse, datepicker, dropdownmenu, form,
  input, link, list, loading, modaldialog, announcement, notification,
  pagination, popover, progress, radiobutton,
  select, slider, steps, switch,
  tabs, table, tag, tooltip
);
$item-width: 146px;
.flat-component-list {
  list-style: none;
  flex-wrap: wrap;
  display: flex;
  padding: 0 5px;
  .flat-component-item {
    list-style: none;
    flex: 0 0 auto;
    width: 25%;
    padding: 15px;
    text-align: center;
    .flat-component {
      // width: 140px;
      background: #fff;
      border-radius: 2px;
      overflow: hidden;
      border: 1px solid #EDF0F7;
      transition: all .3s ease-out;
      cursor: pointer;

      &:hover {
        // margin-top: -10px;
        transform: translateY(-10px);
        box-shadow: 0 12px 12px 0 rgba(120,155,197,0.11);
      }
      &.component-active {
        // transform: translateY(0px);
        // // box-shadow: none;
        // box-shadow: 0 6px 7px 0 rgba(120,155,197,0.14);
        // border-color: #4E73FF;
      }
    }

    &:nth-child(odd) {
      .flat-bg {
        background-color: #F6F5FF;
      }
    }
    &:nth-child(even) {
      .flat-bg {
        background-color: #F1F8FF;
      }
    }
    .flat-bg {
      height: 115px;
      background-size: cover;
    }
    .flat-text {
      &::before {
        content: '';
        display: table;
      }
      height: 54px;
      line-height: 54px;
      .double-line {
        height: 40px;
        margin-top: 7px;
        line-height: 20px;
      }
      // line-height: 54px;
    }

  }

}
@each $component in $component-name {
  .component-#{$component} {
    background-image: url(~../assets/pic_#{$component}@2x.png);
  }
}
</style>
