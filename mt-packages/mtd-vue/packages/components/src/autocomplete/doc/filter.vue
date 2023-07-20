<template>
  <div>
    <mtd-autocomplete 
      v-model="query" 
      class="select-width"
      @search="search"
      >
      <mtd-option
        v-for="item in options"
        :key="item.value"
        :value="item.value">
        <text-highlight :queries="[query]">{{ item.label }}</text-highlight>
      </mtd-option>
    </mtd-autocomplete>
  </div>
</template>
<script>
import TextHighlight from 'vue-text-highlight';

const options = [{
  value: '李白',
  label: '李白',
}, {
  value: '李贺',
  label: '李贺',
}, {
  value: '杜甫',
  label: '杜甫',
  disabled: true,
}, {
  value: '白居易',
  label: '白居易',
}, {
  value: '屈原',
  label: '屈原',
}];

export default {
  components: {
    TextHighlight,
  },
  data () {

    return {
      options: options,
      query: '',
    };
  },
  methods: {
    search () {
      if (this.query) {
        this.options = options.filter(item => {
          console.log(this.query,item.label)
          return item.label.indexOf(this.query) > -1;
        });
      }
    },
  },
};
</script>
<style lang="scss">
  .type-and-use-size p {
    font-size: 14px;
    color: #464646;
    letter-spacing: 0;
  }
  .type-and-use-size {
    margin: 0 20px;
    display:inline-block;
    width: 25%;
    text-align: left;
    vertical-align: top;
  }
</style>