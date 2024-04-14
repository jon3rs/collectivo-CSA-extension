<script setup lang="ts">
import { getRelations } from '~/composables/csaUtils';

definePageMeta({
  middleware: ["auth"],
});
setCollectivoTitle("Lieferzyklen");


const deliveryCycles: csaDeliveryCycle[] = await getCSADeliveryCycles();
const fieldsOfDeliveryCycles = await getFieldsByCollection("csa_delivery_cycle");
const fieldsOfExceptions = await getFieldsByCollection("csa_delivery_cycle_exception");
const relations = await getRelations();

onMounted(() => {
  console.log(deliveryCycles.length);
  console.log("fields of delivery cycles: ",fieldsOfDeliveryCycles);
  console.log("fields of delivery cycles exceptions: ",fieldsOfExceptions);
  console.log("relations: ",relations);
  /*  deliveryCycles.forEach((deliveryCycle) => {
    if (
      deliveryCycle.date_of_last_delivery !== null &&
      deliveryCycle.interval_of_delivery_cycle !== null
    ) {
      const deliveriesPerCycle = Math.floor(
        (new Date(deliveryCycle.date_of_last_delivery) -
          new Date(deliveryCycle.date_of_first_delivery)) /
          1000 /
          60 /
          60 /
          24 /
          deliveryCycle.interval_of_delivery_cycle
      );
      console.log(deliveriesPerCycle);
    }
  }); */
});
</script>

<template>
  <div>
    <div v-if="deliveryCycles.length == 0">
      <p>
        Es gibt noch keine Lieferungen/Lieferzyklen,
        <a
          href="http://localhost:8055/admin/content/csa_delivery_cycle/+"
          target="_blank"
        >
          lege jetzt im Studio eine(n) an!
          <UIcon name="i-heroicons-arrow-top-right-on-square"
        /></a>
      </p>
    </div>
    <div v-else>
      <p><a
          href="http://localhost:8055/admin/content/csa_delivery_cycle/+"
          target="_blank"
        >
          Neue Lieferung/Neuen Lieferzyklus anlegen.
          <UIcon name="i-heroicons-arrow-top-right-on-square"
        /></a></p>
      <div v-for="deliveryCycle in deliveryCycles" :key="deliveryCycle.id">
        <CSADeliveryCycle :deliveryCycle="deliveryCycle" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
a {
  @apply text-primary underline;
}
</style>
