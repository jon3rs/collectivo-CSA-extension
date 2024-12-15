<!-- This section will be available under /example -->

<script setup lang="ts">
setCollectivoTitle("Ernte gut, alles gut");
const isOpen = ref(false);
const addHarvest = ref(false);
const harvests = ref<Harvest[]>(await getHarvests());
const toggled = ref<number[]>([]);

watch(addHarvest, (value) => {
  console.log("addHarvest changed", addHarvest, value);
});

function toggle(id: number) {
  if (toggled.value.includes(id)) {
    toggled.value = toggled.value.filter((toggledId) => toggledId !== id);
  } else {
    toggled.value.push(id);
  }
}

async function addNewHarvest(harvest: Harvest) {
  console.log("addNewHarvest", harvest);
  console.log("harvests", harvests.value);
  addHarvest.value = false;
  toggled.value = [];
  toggled.value.push(harvest.id);
  harvests.value = await getHarvests();
}
</script>

<template>
  <div>
    <div>
      <p>neue Ernte anlegen:</p>
      <UButton icon="i-heroicons-plus" @click="addHarvest = true" />
    </div>

    <div v-if="addHarvest">
      <!-- potentially inside a  modal and / or own page-->
      <Harvest
        toggled="true"
        @cancel="addHarvest = false"
        @harvest-added="
          (harvest: Harvest) => {
            addNewHarvest(harvest);
          }
        "
      />
    </div>
    <Harvest
      v-for="(harvest, index) in harvests"
      :key="harvest.id"
      :harvest="harvest"
      :toggled="toggled.includes(harvest.id)"
      @toggle="(id: number) => toggle(id)"
    />

    <!-- ifNewHarvest -->

    <!-- v-ForOldHarvests -->

    <!-- <UButton
      label="Ernte anlegen"
      icon="i-heroicons-plus"
      @click="isOpen = true"
    ></UButton>
    <UModal v-model="isOpen">
      <AddHarvest />
    </UModal> -->
  </div>
</template>
