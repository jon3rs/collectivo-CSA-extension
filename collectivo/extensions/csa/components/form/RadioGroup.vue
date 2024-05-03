<script setup lang="ts">
const props = defineProps({
  selectedValue: {type: Number, required: false},
  options: Array as PropType<Choice[]>,
  disabled: Boolean,
});

const emit = defineEmits(["update", "cancel"]);

const selection = ref(props.selectedValue);

</script>

<template>
  <div>
    <URadioGroup v-model="selection" :disabled="disabled"  :options="options" />
    <!--       @change="$emit('update', selection)"
 -->
    <UButton @click="$emit('update', selection)">update</UButton>
    <UButton @click="$emit('cancel')">cancel</UButton>
  </div>
</template>
