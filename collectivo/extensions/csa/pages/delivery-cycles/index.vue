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
