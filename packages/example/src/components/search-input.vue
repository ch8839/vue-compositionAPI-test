<template>
  <div class="search-input">
    <mtd-select
      icon="search"
      placeholder="搜索"
      filterable
      @focus="handleFocus"
      @blur="handleBlur"
      :model-value="search"
      @change="handleSearch"
      popper-class="search-dropdown"
    >
      <mtd-option
        v-for="nav in components" 
        :key="nav.path"
        :label="`${nav.cnName} / ${nav.name}`"
        :value="nav.path" 
      />
    </mtd-select>
  </div>
</template>
<script>
export default {
  props: {
    components: Array,
  },
  data () {
    return {
      focused: false,
      search: '',
    }
  },
  methods: {
    handleFocus () {
      this.focused = true
    },
    handleBlur () {
      this.focused = false
    },
    handleSearch (v) {
      this.search = v
      if (this.search) {
        this.$router.push(`/components/${this.search}`)
        this.$nextTick(() => { this.search = '' })
      }
    },
  },
}
</script>
<style lang="scss">
@import '../styles/var.scss';
$icon-width: 34px;

.search-input {
  display: inline-block;
  display: flex;

  .mtd-select {
    width: 156px;
    flex: 1;
  }
  .mtd-select-search-focus{
    .mtd-input-suffix-inner{
      i{
        transform: none;
      }
    }
  }
}
.search-dropdown{
  &[x-placement^="bottom"]{
    margin-top: 4px;
  }
  .mtd-dropdown-menu{
    margin: 4px 0px;
    padding: 0px;
  }
}
</style>
