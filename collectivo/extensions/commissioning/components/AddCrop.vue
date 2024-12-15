<script setup lang="ts">
const props = defineProps({
  nameOfCrop: {
    type: String,
    required: false,
  },
  units: {
    type: Array<comUnit>,
    required: true,
  },
});

const emit = defineEmits(["closeModal", "addedCrop"]);

const labelledUnits = computed(() => {
  return props.units.map((unit) => {
    return {
      value: unit.id,
      label: unit.name_of_unit,
    };
  });
});

const name = ref(props.nameOfCrop);
const selectedUnit = ref(null);
const defaultPackagingUnit = ref(null);

function saveNewCrop() {
  console.log(
    "crop to save",
    name.value,
    selectedUnit.value,
    defaultPackagingUnit.value
  );

  let cropToAdd = { name_of_crop: name.value };

  if (defaultPackagingUnit.value) {
    cropToAdd.default_packaging_unit = defaultPackagingUnit.value;
  }

  if (selectedUnit.value) {
    cropToAdd.default_unit = selectedUnit.value;
  }

  addCrop(cropToAdd).then((response) => {
    console.log("crop added", response);
    emit("addedCrop", response.id);
    emit("closeModal");
  });

  emit("closeModal");
}
</script>

<template>
  <div class="p-4">
    <h3>neue Kultur anlegen:</h3>
    <p>Name der Kultur:</p>
    <UInput
      v-model="name"
      placeholder="Name der Kultur"
      legend="Name der Kultur"
    />
    <URadioGroup
      :ui="{
        wrapper: 'relative flex items-start',
        fieldset: 'flex flex-row',
        legend: 'text-sm font-medium text-gray-700 dark:text-gray-200 mb-1',
        default: {
          color: 'primary',
        },
      }"
      class="flex"
      v-model="selectedUnit"
      legend="Standard Einheit"
      :options="labelledUnits"
    />

    <!-- <USelect
      v-model="defaultUnit"
      :options="units"
      placeholder="Wähle eine Standardeinheit"
    ></USelect> -->
    <p>Standard Verpackungseinheit</p>
    <UInput v-model="defaultPackagingUnit" type="number"></UInput>
    <div class="mt-5 flex justify-end">
      <UButton color="gray" label="abbrechen" @click="$emit('closeModal')" />
      <UButton class="ml-2" label="speichern" @click="saveNewCrop()" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
fieldset {
  @apply flex flex-row;
}
</style>
