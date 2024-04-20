<script setup lang="ts">
import {
  formatDate,
  getDeliveryCycleActualDeliveries,
  createIntervalDescription
} from "@/composables/csaUtils";

const props = defineProps({
  deliveryCycle: {
    type: Object as PropType<csaDeliveryCycle>,
    required: true,
  },
});

const deliveryListExpanded = ref(false);
const currentPage = ref(0);
const maxRegularDeliveriesToDisplay = 10;
const deliveriesToDisplay: Ref<(Date | csaDeliveryCycleException)[]> = ref([]);
const firstDate: Ref<Date> = ref(new Date());
const lastDate: Ref<Date> = ref(new Date());
/* const deliveryExceptions = await getCSADeliveryCycleExceptionsOfDeliveryCycleByID(
  props.deliveryCycle.id
); */

watch(currentPage, async (newPage) => {
  await updateDeliveriesToDisplay()
  setCurrentFirstAndLastDate();
});

onMounted(async () => {
  await updateDeliveriesToDisplay()
  setCurrentFirstAndLastDate();
});

const dateOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

//const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];


async function updateDeliveriesToDisplay(){
  deliveriesToDisplay.value = await getDeliveryCycleActualDeliveries(
    props.deliveryCycle,
    10,
    currentPage.value
  );
}

function setCurrentFirstAndLastDate() {
  if (deliveriesToDisplay.value[0] instanceof Date) {
    firstDate.value = deliveriesToDisplay.value[0];
  } else {
    firstDate.value = deliveriesToDisplay.value[0].original_delivery_date;
  }
  //had to declare a new variable to avoid type error

  const lastEntry =
    deliveriesToDisplay.value[deliveriesToDisplay.value.length - 1];

  if (lastEntry instanceof Date) {
    lastDate.value = lastEntry;
  } else {
    lastDate.value = lastEntry.original_delivery_date;
  }
}



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
          {{ deliveryCycle.name_of_delivery_cycle }} {{ deliveryCycle.id  }}
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
          <UIcon name="i-heroicons-pencil-solid" />
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
          {{ createIntervalDescription(deliveryCycle) }}
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
            {{ createIntervalDescription(deliveryCycle) }}
          </p>
        </div>
      </div>
      <div v-if="deliveryCycle.type_of_delivery_cycle !== 'single'">
        <div class="lg:flex justify-between mb-3">
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
          <div v-if="deliveryListExpanded" class="md:flex justify-between mt-2 lg:mt-0">
            <div
              class="rounded-full px-3 w-fit p-2 text-sm bg-slate-100 text-slate-800"
            >
              Zeitraum:
              {{ formatDate(firstDate) }}
              bis
              {{ formatDate(lastDate) }}
            </div>
            <div class="pagination text-right md:text-left">
              <UButton
                variant="link"
                :disabled="currentPage == 0"
                icon="i-heroicons-chevron-left-solid"
                @click="currentPage--"
              /><UButton
                variant="link"
                :disabled="
                  deliveryCycle.type_of_delivery_cycle == 'single' ||
                  (deliveryCycle.date_of_last_delivery &&
                    calculateAdjacentDelivery(
                      new Date(deliveryCycle.date_of_first_delivery),
                      (currentPage + 1) * maxRegularDeliveriesToDisplay,
                      deliveryCycle
                    ) > new Date(deliveryCycle.date_of_last_delivery))
                "
                icon="i-heroicons-chevron-right-solid"
                @click="currentPage++"
              />
            </div>
          </div>
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
            <CSADeliveryListItem
              :delivery="delivery"
              :index="index"
            />
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
