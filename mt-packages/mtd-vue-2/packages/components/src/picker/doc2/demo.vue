<template>
  <div>
    <h2>Picker</h2>
    <h3>选择器</h3>
    <Base />
    <Filterable />
    <DemoSlots />
  </div>
</template>
<script>
import Base from './base.vue';
import Filterable from './filterable.vue'
import DemoSlots from './slots.vue';

export default {
  name: 'DemoPicker',
  components: {
    Base,
    Filterable,
    DemoSlots,
  },
}
</script>
