<script setup lang="ts">
import HarvestItem from "./HarvestItem.vue";

const props = defineProps({
  harvest: {
    type: Object as PropType<Harvest>,
    required: false,
  },
  toggled: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["toggle", "cancel", "harvestAdded"]);

const initialHarvest = ref<Partial<Harvest>>({
  name_of_harvest: "",
  com_harvest_item: [],
  harvest_notes: "",
});

const nameOfHarvest = ref("");
const harvestItems = ref<HarvestItem[]>([]);

const harvestNote = ref(props?.harvest?.harvest_notes || "");

onMounted(async () => {
  if (props.harvest) {
    loadHarvestData(props.harvest);
  }
});

async function loadHarvestData(harvest: Harvest) {
  nameOfHarvest.value = harvest.name_of_harvest;
  initialHarvest.value.name_of_harvest = harvest.name_of_harvest;
  initialHarvest.value.harvest_notes = harvest.harvest_notes;
  console.log("loading harvest data", harvest);

  harvestItems.value = await Promise.all(
    harvest.com_harvest_item.map(async (id: number) => {
      try {
        const item = await getHarvestItem(id);
        return {
          harvested_crop: item.harvested_crop,
          harvested_amount: item.harvested_amount,
          items_unit: item.items_unit,
          id: item.id,
        };
      } catch (e) {
        console.log(e);
      }
    })
  );

  initialHarvest.value.com_harvest_item = JSON.parse(
    JSON.stringify(harvestItems.value)
  );
}

function removeHarvestItem(index: number) {
  console.log(index, harvestItems.value);
  harvestItems?.value?.splice(index, 1);
}

function saveHarvest(id?: number) {
  //ask if there's an Id, if yes, update

  if (props?.harvest?.id) {
    const updatedHarvest = {
      id: props.harvest.id,
      name_of_harvest: nameOfHarvest.value,
      com_harvest_item: toRaw(harvestItems.value),
      harvest_notes: harvestNote.value,
    };

    updateHarvest(updatedHarvest).then((response: Harvest) => {
      loadHarvestData(response);
      console.log("harvest updated", response);
    });

    return;
  }

  console.log("no Id", props?.harvest?.id);

  createHarvest(
    nameOfHarvest.value,
    harvestItems.value,
    harvestNote.value
  ).then((response: Harvest) => {
    loadHarvestData(response);
    emit("harvestAdded", response);
    console.log("harvest added", response);
  });
}

function addBlankHarvestItem() {
  console.log("pushing blank item");

  harvestItems.value.push({
    harvested_crop: null,
    harvested_amount: 0,
    items_unit: null,
  });

  console.log("this is harvestItems now: ", harvestItems.value);
}

function arraysEqual(a: any[], b: any[]): boolean {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    console.log("comparing: ", a[i], b[i]);

    if (typeof a[i] === "object" && typeof b[i] === "object") {
      const keysA = Object.keys(a[i]);
      const keysB = Object.keys(b[i]);
      console.log("array?", keysA, keysB);

      if (keysA.length !== keysB.length) return false;

      for (let key of keysA) {
        console.log("the key: ", key, a[i][key], b[i][key]);
        if (a[i][key] !== b[i][key]) return false;
      }
    } else {
      if (a[i] !== b[i]) return false;
    }
  }

  return true;
}

// Computed property to determine if the button should be disabled

const nameHasChanged = computed(() => {
  return initialHarvest?.value?.name_of_harvest !== nameOfHarvest.value;
});

const notesHaveChanged = computed(() => {
  console.log(
    "notes state",
    initialHarvest?.value?.harvest_notes,
    harvestNote.value
  );

  const stringToCompare = initialHarvest?.value?.harvest_notes
    ? initialHarvest?.value?.harvest_notes
    : "";

  return stringToCompare !== harvestNote.value;
});

const harvestItemsHaveChanged = computed(() => {
  return spotChanges(harvestItems.value);
});

function spotChanges(harvestItems: Array<HarvestItem>) {
  console.log(
    "spotting changes",
    harvestItems,
    initialHarvest?.value?.com_harvest_item
  );

  if (harvestItems.length !== initialHarvest?.value?.com_harvest_item?.length) {
    return true;
  }

  if (arraysEqual(initialHarvest?.value?.com_harvest_item, harvestItems)) {
    return false;
  } else {
    return true;
  }
}

function cancel() {
  if (!props.harvest) {
    emit("cancel");
  } else {
    loadHarvestData(props.harvest);
  }
}

const hasCommissioning = computed(() => {
  return props.harvest?.harvests_commissioning;
});

async function startCommissioning() {
  console.log("starting commissioning");

  if (props.harvest?.id) {
    await createCommissioning(props.harvest?.id).then((response) => {
      console.log("commissioning started", response);
      navigateTo(`/commissioning/${response.id}`);
    });
  } else {
    console.error("no harvest id");
  }
  // redirect to commissioning page
}
</script>

<template>
  <div class="card bg-green-50 mb-5" @click="toggled == !toggled">
    <div class="flex justify-between">
      <div v-if="!toggled && props.harvest?.id">
        <span>{{ nameOfHarvest }}</span>
      </div>
      <div v-else>
        <UInput v-model="nameOfHarvest" placeholder="KW ..." />
      </div>
      <div
        v-if="
          hasCommissioning && props?.harvest?.harvests_commissioning !== null
        "
      >
        <NuxtLink
          :to="`/commissioning/${props?.harvest?.harvests_commissioning}`"
          >zur Kommissionierung
        </NuxtLink>
      </div>
      <div v-else-if="props.harvest?.id">
        <UButton
          @click="startCommissioning()"
          label="Kommissionierung starten"
        />
      </div>
      <UIcon
        v-if="props.harvest?.id"
        :name="
          toggled
            ? 'i-heroicons-chevron-up-solid'
            : 'i-heroicons-chevron-down-solid'
        "
        @click="$emit('toggle', props.harvest?.id)"
      />
    </div>
    <div v-if="toggled">
      <table class="table-auto w-full border-spacing-3">
        <thead>
          <tr>
            <th>Kultur</th>
            <th>Menge</th>
            <th>Einheit</th>
          </tr>
        </thead>
        <tbody>
          <HarvestItem
            v-for="(harvestItem, index) in harvestItems"
            :key="harvestItem.id"
            v-model="harvestItems[index]"
            :index="index"
            @remove-harvest-item="(index) => removeHarvestItem(index)"
          />
        </tbody>
      </table>
      <div>
        <UButton
          label="Kultur hinzufügen"
          icon="i-heroicons-plus"
          @click="addBlankHarvestItem()"
        />
      </div>
      <div class="mt-2">
        <p>Notizen zur Ernte:</p>
        <UTextarea v-model="harvestNote" />
      </div>

      <div class="mt-5 flex justify-end">
        <UButton
          color="gray"
          label="abbrechen"
          :disabled="
            !nameHasChanged && !harvestItemsHaveChanged && !notesHaveChanged
          "
          @click="cancel()"
        />
        <UButton
          class="ml-2"
          :label="props.harvest ? 'Änderungen speichern' : 'Ernte anlegen'"
          :disabled="
            !nameHasChanged && !harvestItemsHaveChanged && !notesHaveChanged
          "
          @click="saveHarvest()"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  @apply h-fit w-full rounded-[15px] relative overflow-hidden p-6 overflow-visible;
}
</style>
<!--  :disabled="
          initialHarvest.name_of_harvest == nameOfHarvest ||
          initialHarvest.com_harvest_item == harvest
        " -->
