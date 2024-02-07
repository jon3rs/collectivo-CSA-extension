<script setup lang="ts">
const props = defineProps({
  shareInstanceId: {
    type: Number,
    required: true,
  },
});

onBeforeMount(() => {
  console.log("props: ", props.shareInstanceId);
});

const shareInstance = await getCSARecurringShareInstanceById(
  props.shareInstanceId,
);

const dateOfDelivery = await getCSADeliveryById(
  shareInstance.for_delivery,
).then((res: csaDelivery) => {
  return res.date_of_delivery;
});
</script>

<template>
  <div>
    <div class="flex justify-between">
      <p>Datum: {{ dateOfDelivery }}</p>
    </div>
  </div>
</template>
