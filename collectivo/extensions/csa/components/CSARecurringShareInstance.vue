<script setup lang="ts">
const props = defineProps({
  shareInstanceId: {
    type: Number,
    required: true,
  },
});

const items = [[{ label: "Limes" }, { label: "Tante Olga" }]];

const refreshShareInstance = async () => {
  shareInstance.value = await getCSARecurringShareInstanceById(
    props.shareInstanceId
  );
};

const shareInstance = ref<csaRecurringShareInstance>(
  await getCSARecurringShareInstanceById(props.shareInstanceId)
);

onBeforeMount(() => {
  refreshShareInstance();
});

onMounted(() => {});

const dateOfDelivery = await getCSADeliveryById(
  shareInstance.value.for_delivery
).then((res: csaDelivery) => {
  const options = {
    weekday: "long" as const,
    year: "numeric" as const,
    month: "long" as const,
    day: "numeric" as const,
  };

  const deliveryDate = new Date(res.date_of_delivery).toLocaleDateString(
    "de-DE",
    options
  );

  return deliveryDate;
});

async function toggleInstanceStatus() {
  await updateCSARecurringShareInstanceStatus(
    shareInstance.value.id,
    !shareInstance.value.csa_share_instance_status
  ).then((res: csaRecurringShareInstance) => {
    shareInstance.value = res;
  });
}

const statusButtonText = computed(() => {
  return shareInstance.value.csa_share_instance_status
    ? "skip delivery"
    : "skipped";
});

const depotPickerButtonText = computed(() => {
  return depotPickerToggle.value ? "abbrechen" : "Depot wechseln";
});

const shareInstanceDepotName = ref<string>(
  await getCSADepotById(
    shareInstance.value.csa_recurring_share_instance_depot
  ).then((res: csaDepot) => {
    return res.csa_depot_name;
  })
);

async function updateRecurringShareInstanceDepot(depot: number) {
  await updateCSARecurringShareInstanceDepot(
    shareInstance.value.id,
    depot
  ).then((res: csaRecurringShareInstance) => {
    shareInstance.value = res;
    depotPickerToggle.value = false;
    refreshShareInstance();
  });
}

const depotPickerToggle = ref(false);

//would be nicer if this was saved somewhere globally instead of accessing it inside each individual shareInstance
const availableDepots = ref<csaDepot[]>(await getCSADepots());

const depotOptions = ref<Choice[]>([]);

availableDepots.value.forEach((depot) => {
  depotOptions.value.push({
    label: depot.csa_depot_name,
    value: depot.id,
  });
});
</script>

<template>
  <div class="card">
    <div
      class="flex justify-between w-full"
      :class="shareInstance.csa_share_instance_status ? '' : 'disabled'"
    >
      <div class="inline-block">
        <p>
          {{ dateOfDelivery }} •
          {{ shareInstanceDepotName }}
        </p>
      </div>
      <div class="flex">
        <div class="mr-4">
          <div class="flex justify-between">
            <p v-if="depotPickerToggle">choose depot:</p>
            <UButton
              class="mb-4"
              @click="depotPickerToggle = !depotPickerToggle"
              :disabled="!shareInstance.csa_share_instance_status"
              :class="depotPickerToggle ? 'bg-gray-500 hover:bg-gray-800' : ''"
              >{{ depotPickerButtonText }}</UButton
            >
          </div>
          <FormRadioGroup
            class=""
            v-if="depotPickerToggle"
            :disabled="!shareInstance.csa_share_instance_status"
            :options="depotOptions"
            :selectedValue="shareInstance.csa_recurring_share_instance_depot"
            @update="updateRecurringShareInstanceDepot($event)"
          />
        </div>
        <UButton
          class="h-fit"
          :disabled="!shareInstance.csa_share_instance_status"
          @click="toggleInstanceStatus()"
          >{{ statusButtonText }}</UButton
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  @apply my-5 rounded-xl bg-white shadow-sidebar px-3 py-5 flex w-full;
}
.disabled {
  @apply text-gray-400 italic;
}
</style>
