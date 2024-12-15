<script setup lang="ts">
setCollectivoTitle("🕯 Kommissionierung");
const route = useRoute();

onMounted(() => {
  console.log("route Params: ", route.params);

  console.log("mounted");
});
</script>

<template>
  <div>eöhh {{ route.params }}</div>
</template>
