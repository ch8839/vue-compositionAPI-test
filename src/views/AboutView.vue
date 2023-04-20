<template>
  <div class="ui-container">
    <div class="ui-list">
      <ul>
        <li v-for="(item, index) of pageList" :key="index">
          <router-link :to="item.path">{{ item.name }}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { pageList } from '../router/index'
export default defineComponent({
  name: 'UI',
  setup(props, context) {
    return { pageList }
  },
})
</script>

<style lang="scss" scoped>
.ui-container {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #fff;
  .ui-list {
    flex: 1;
    // border: 1px solid #59da48;
    & ul {
      list-style: none;
      margin: 0px;
      padding: 0px;
      & li {
        margin-top: 20px;
        padding: 10px 20px;
        text-align: left;
        background: #f7f8fa;

        font-weight: 600;
        border-radius: 50px;

        & a {
          position: relative;
          display: block;
          text-decoration: none;
          color: #323233;
          &:hover {
            background: #3498db;
          }
          &:after {
            content: '>';
            position: absolute;
            right: 5px;
          }
        }
        .router-link-active {
          background-color: #ee7c5a;
          color: white;
        }
      }
    }
  }
  .ui-content {
    flex: 3;
    border: 1px solid #1a62ce;
  }
}
</style>
