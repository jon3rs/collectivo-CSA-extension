<script setup lang="ts">
const props = defineProps({
  selectedValue: Number,
  options: Array as PropType<Choice[]>,
  disabled: Boolean,
});

const emit = defineEmits(["update"]);

const selection = ref(props.selectedValue);

console.log("selectedValue: ", props.selectedValue);
console.log("options: ", props.options);
</script>

<template>
  <div>
    <URadioGroup
      :disabled="disabled"
      v-model="selection"
      :options="options"
      @change="$emit('update', selection)"
    />
  </div>
</template>
