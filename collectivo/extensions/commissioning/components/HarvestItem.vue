<script setup lang="ts">
const crops: Ref<comCrop[]> = ref(await getCrops());
const units: Ref<comUnit[]> = ref(await getUnits());
const selectedCrop = ref<comCrop | null>(null);
const selectedUnit = ref<comUnit | null>(null);
const query = ref("");
const cropToAdd = ref("");
const addCropModal = ref(false);

const props = defineProps({
  modelValue: {
    type: Object as PropType<HarvestItem>,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "removeHarvestItem"]);

const localHarvestItem = ref({ ...props.modelValue });

watch(
  localHarvestItem,
  (newValue) => {
    if (typeof newValue.items_unit === "string")
      newValue.items_unit = parseInt(newValue.items_unit);

    console.log(
      "localHarvestItem changed",
      newValue,
      typeof newValue.items_unit,
      localHarvestItem
    );

    emit("update:modelValue", newValue);
  },
  { deep: true }
);

/* onMounted(() => {
  console.log("selectedUnit mounted", selectedUnit.value);
}); */

function addCrop(query: string) {
  cropToAdd.value = query;
  addCropModal.value = true;
  console.log("addCrop", query, units.value);
}

async function setSelectedCrop(id: number) {
  crops.value = await getCrops();
  selectedCrop.value = crops.value.find((crop) => crop.id === id);
}

onMounted(() => {
  if (props) setSelectedCrop(localHarvestItem.value.harvested_crop);
});

watch(selectedCrop, (value) => {
  if (value && value.default_unit) {
    /* console.log(
      "selectedCrop value",
      value.default_unit,
      units.value,
      units.value.find((unit) => unit.id == value.default_unit)
    ); */

    const tempUnit = units.value.find((unit) => unit.id == value.default_unit);
    if (tempUnit && tempUnit.id)
      localHarvestItem.value.items_unit = tempUnit.id;
  }

  if (value && value.id) localHarvestItem.value.harvested_crop = value?.id;
  /*   console.log("selectedCrop changed", value, value?.default_unit);
   */
});

watch(selectedUnit, (value) => {
  //localHarvestItem.value.items_unit = value;
  console.log("selectedUnit changed", value);
});
</script>

<template>
  <tr>
    <td class="flex">
      <UButton
        icon="i-heroicons-x-mark"
        @click="$emit('removeHarvestItem', index)"
      />
      <UInputMenu
        v-model="selectedCrop"
        v-model:query="query"
        :options="crops"
        placeholder="Choose or add a new crop"
        option-attribute="name_of_crop"
        :search-attributes="['name_of_crop']"
      >
        <template #option-empty="{ query }">
          <UButton @click="addCrop(query)">
            <q> {{ query }}</q> hinzufügen</UButton
          >
        </template>
      </UInputMenu>
    </td>
    <td>
      <UInput v-model="localHarvestItem.harvested_amount" type="number" />
    </td>
    <td>
      <USelect
        v-model="localHarvestItem.items_unit"
        :options="units"
        placeholder="Choose a unit"
        value-attribute="id"
        option-attribute="name_of_unit"
      />
    </td>
  </tr>
  <UModal v-model="addCropModal">
    <AddCrop
      :name-of-crop="cropToAdd"
      :units="units"
      @added-crop="
        (id: number) => {
          setSelectedCrop(id);
        }
      "
      @close-modal="() => (addCropModal = false)"
    />
  </UModal>
</template>
