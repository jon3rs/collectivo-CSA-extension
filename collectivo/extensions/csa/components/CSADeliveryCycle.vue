<script setup lang="ts">
import {
  formatDate,
  getDeliveryCycleActualDeliveries,
} from "@/composables/csaUtils";

const props = defineProps({
  deliveryCycle: {
    type: Object as PropType<csaDeliveryCycle>,
    required: true,
  },
});

const deliveryListExpanded = ref(false);
const currentPage = ref(0);
/* const deliveryExceptions = await getCSADeliveryCycleExceptionsOfDeliveryCycleByID(
  props.deliveryCycle.id
); */

watch(currentPage, async (newPage) => {

  deliveriesToDisplay.value = await getDeliveryCycleActualDeliveries(
    props.deliveryCycle,
    10,
    newPage
  );
  
});

onMounted(async () => {
  deliveriesToDisplay.value = await getDeliveryCycleActualDeliveries( props.deliveryCycle, 10, currentPage.value)
});

const dateOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

//const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const weekday = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];

function createIntervalDescription() {
  let day: string = "";

  if (
    props.deliveryCycle.repeats_on != null  &&
    props.deliveryCycle.interval_of_delivery_cycle
  ) {
    day = weekday[props.deliveryCycle.repeats_on];

    switch (props.deliveryCycle.interval_of_delivery_cycle) {
      case "weekly":
        return `jeden ${day}`;
      case "biweekly":
        return `alle zwei Wochen am ${day}`;
      case "first_of_month":
        return `jeden ersten ${day} des Monats`;
      case "second_of_month":
        return `jeden zweiten ${day} des Monats`;
      case "third_of_month":
        return `jeden dritten ${day} des Monats`;
      case "last_of_month":
        return `jeden letzten ${day} des Monats`;
    }
  }
}

const deliveriesToDisplay = ref( );

function toggleDeliveries() {
  //const currentState = deliveryCycle.extended;
  deliveryListExpanded.value = !deliveryListExpanded.value;
}
</script>

<template>
  <div>
    <div class="my-5 rounded-xl bg-white shadow-sidebar px-3 py-5 block">
      <div class="flex justify-between mb-5">
        <h2 class="pr-3 break-all">
          {{ deliveryCycle.name_of_delivery_cycle }}
          {{ deliveryCycle.interval_of_delivery_cycle ? deliveryCycle.interval_of_delivery_cycle : "" }}
          {{ deliveryCycle.repeats_on ? deliveryCycle.repeats_on : "" }}
        </h2>
        <NuxtLink
          :href="
            'http://localhost:8055/admin/content/csa_delivery_cycle/' +
            deliveryCycle.id
          "
          target="_blank"
          class="edit-button flex items-center justify-center self-start p-2 grow-0 rounded-full bg-primary text-white"
          aria-label="Edit delivery cycle in Studio"
        >
          <UIcon name="i-mi-edit" />
        </NuxtLink>
      </div>
      <div
        v-if="deliveryCycle.type_of_delivery_cycle == 'single'"
        class="flex items-center"
      >
        <div>
          <UIcon
            class="delivery-cycle-icon"
            name="i-heroicons-calendar-days-solid"
          />
        </div>
        <p>
          {{ formatDate(deliveryCycle.date_of_first_delivery) }}
        </p>
      </div>
      <div v-else-if="deliveryCycle.type_of_delivery_cycle == 'infinite'">
        <p>
          <UIcon
            class="delivery-cycle-icon"
            name="i-heroicons-calendar-days-solid"
          />
          {{ formatDate(deliveryCycle.date_of_first_delivery) }} - &infin;
        </p>
        <p class="mt-1">
          <UIcon
            class="delivery-cycle-icon"
            name="i-heroicons-arrow-path-solid"
          />
          {{ createIntervalDescription() }}
        </p>
      </div>
      <div v-else-if="deliveryCycle.type_of_delivery_cycle == 'finite'">
        <div class="flex items-center">
          <div class="flex items-center">
            <UIcon
              class="delivery-cycle-icon"
              name="i-heroicons-calendar-days-solid"
            />
          </div>
          <p
            v-if="deliveryCycle.date_of_last_delivery"
            class="flex items-center"
          >
            {{ formatDate(deliveryCycle.date_of_first_delivery) }} bis
            {{ formatDate(deliveryCycle.date_of_last_delivery) }}.
          </p>
        </div>
        <div class="mt-2 flex items-center">
          <div>
            <UIcon
              class="delivery-cycle-icon"
              name="i-heroicons-arrow-path-solid"
            />
          </div>
          <p>
            {{ createIntervalDescription() }}
          </p>
        </div>
      </div>
      <div
        v-if="deliveryCycle.type_of_delivery_cycle !== 'single'"
      >
        <div class="flex justify-between mb-3">
          <UButton
            class="toggle-deliveries-button underline"
            variant="link"
            :class="{ deliveryListExpanded: deliveryListExpanded }"
            aria-expanded="false"
            @click="toggleDeliveries()"
            icon="i-heroicons-chevron-down-solid"
          >
            Lieferungen anzeigen</UButton
          >
          <div class="pagination"> <UButton @click="()=>{currentPage--}" variant="link" :disabled="currentPage == 0" icon="i-heroicons-chevron-left-solid"/><UButton @click="currentPage++" variant="link" icon="i-heroicons-chevron-right-solid"/></div>
        </div>
        <div
          v-if="
            deliveryListExpanded && deliveryCycle.interval_of_delivery_cycle
          "
        >
          <div v-for="(delivery, index) in deliveriesToDisplay" :key="index">
            <!-- <p>
              Delivery {{ index + 1 }} on <span>{{ delivery }}</span>
            </p> -->
            <CSADeliveryListItem :delivery="delivery" :index="index" :deliveryCycleId="deliveryCycle.id" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.deliveryListExpanded span {
  transform: rotate(180deg);
  /* animation: 2s; */
}
/* .edit-button{
  @apply ;
} */

.toggle-deliveries-button {
  @apply p-0 mt-3;
}

.delivery-cycle-icon {
  @apply mr-3 text-xl;
}
</style>
