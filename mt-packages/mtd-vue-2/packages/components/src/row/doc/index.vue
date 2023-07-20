<template>
  <div>
    <h1>布局 / Gird</h1>
    <Base />
    <br />
    <Gutter />
    <br />
    <Mix />
    <br />
    <Offset />
    <br />
    <Align />
    <br />
    <api-doc name="Row" :doc="require('../api.json')"></api-doc>
    <api-doc name="Col" :doc="require('../../col/api.json')"></api-doc>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import Base from './base';
import Gutter from './gutter';
import Mix from './mix';
import Offset from './offset';
import Align from './align';

export default defineComponent({
  components: {
    Base,
    Gutter,
    Mix,
    Offset,
    Align,
  },
});
</script>
