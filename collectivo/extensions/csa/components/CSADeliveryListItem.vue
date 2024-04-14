<script lang="ts" setup>
const props = defineProps({
  delivery: {
    type: [Object, Date] as PropType<csaDeliveryCycleException | Date>,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  deliveryCycleId: {
    type: Number,
    required: true,
  }
});
</script>

<template>
  <div
    class="p-2"
    :class="{
      'bg-slate-200': (delivery instanceof Date) && (index % 2 == 1),
      'bg-yellow-200': !(delivery instanceof Date) && (delivery.type_of_exception == 'postponed'),
      'bg-green-200': !(delivery instanceof Date) && (delivery.type_of_exception == 'additional'),
      'bg-red-200': !(delivery instanceof Date) && (delivery.type_of_exception == 'cancelled'),
    }"
  >
    <div v-if="delivery instanceof Date">
      {{ formatDate(delivery) }}
    </div>
    <div v-else>
      <span
        :class="{
          strikethrough:
            delivery.type_of_exception == 'postponed' ||
            delivery.type_of_exception == 'cancelled',
        }"
        >{{ formatDate(delivery.original_delivery_date) }}</span
      >
      <span v-if="delivery.type_of_exception == 'postponed'">
        → {{ formatDate(delivery.new_delivery_date) }}</span
      >
    </div>
    
  </div>
</template>

<style lang="scss" scoped>
.strikethrough {
  text-decoration: line-through;
}

.delivery-list-item {
  @apply bg-slate-200;
}
</style>
