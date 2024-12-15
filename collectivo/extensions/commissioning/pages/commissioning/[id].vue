<script setup lang="ts">
const route = useRoute();
console.log(route.params.id);
</script>

<template>
  <div>
    <p>Howdy and welcome to page with id: {{ route.params.id }}</p>
  </div>
</template>
