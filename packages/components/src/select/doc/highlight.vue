<template>
  <div>
    <mtd-select v-model="value" class="select-width"
      :filterable="true" :remote="true"
      :remote-method="remoteMethod">
      <mtd-option
        v-for="item in options2"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled">
        <div :queries="[query]">{{ item.label }}</div>
      </mtd-option>
    </mtd-select>
  </div>
</template>
<script>
// import TextHighlight from 'vue-text-highlight';
export default {
  components: {
    // TextHighlight,
  },
  data () {
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
    return {
      options: options,
      options2: options,
      value: '',
      query: '',
    };
  },
  methods: {
    remoteMethod (query) {
      this.query = query;
      if (query) {
        this.options2 = this.options.filter(item => {
          return item.label.toLowerCase()
            .indexOf(query && query.toLowerCase()) > -1;
        });
      } else {
        this.options2 = this.options;
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
