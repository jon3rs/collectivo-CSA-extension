<script setup lang="ts">
const props = defineProps({
  csaShare: {
    type: Number,
    required: true,
  },
});
onBeforeMount(() => {
  refreshShare().then(async () => {
    console.log("share: ", share.value.of_share_size);
    refreshDepot();
    shareSize.value = await getCSAShareSizeById(share.value.of_share_size);
    shareType.value = await getCSAShareTypeById(shareSize.value.of_type);
  });
});
const emit = defineEmits(["refreshDepot"]);

const share = ref({});
const refreshShare = async () => {
  console.log("refreshing share");
  share.value = await getCSAShareOfMemberShipById(props.csaShare);
};

//await getCSAShareOfMemberShipById(props.csaShare);
console.log("share: ", share);
const shareSize = ref({});
const shareType = ref({});
const depot = ref({});
const refreshDepot = async () => {
  console.log("refreshing depot");
  depot.value = await getCSADepotById(share.value.default_depot).then((res) => {
    console.log("depot: ", res);
    return res;
  });
};

console.log(props.csaShare);
const depotForm = ref(false);
const csaDepots = await getCSADepots();
const checkedDepot = ref("");
function toggleDepotForm() {
  depotForm.value = !depotForm.value;
}
async function updateDepot(newDepot: number) {
  await updateDefaultDepot(props.csaShare, newDepot).then(() => {
    console.log(newDepot);
    refreshShare().then(() => {
      refreshDepot();
      toggleDepotForm();
      checkedDepot.value = "";
    });
  });
}
</script>

<template>
  <div class="rounded-xl bg-white shadow-sidebar px-3 py-5">
    <p>the id of your share is {{ share.id }}</p>
    <div class="mt-2">
      <span class="inline-block font-bold mr-2">Typ:</span>
      <span>{{ shareType.csa_share_type_name }}</span> <br />
    </div>
    <div class="mt-2">
      <span class="inline-block font-bold mr-2">Größe:</span>
      <span>{{ shareSize.csa_share_size_name }}</span> <br />
    </div>
    <div class="mt-2 transition-all">
      <span class="inline-block font-bold mr-2">Default Depot:</span>
      <span>{{ depot.csa_depot_name }}</span>
      <UButton @click="toggleDepotForm()">switch default depot</UButton>
      <form
        v-if="depotForm == true"
        autocomplete="off"
        class="h-fit transition-all"
      >
        <p>Choose new default depot:</p>
        <ul>
          <li v-for="depot in csaDepots" :key="depot">
            <input
              type="radio"
              :value="depot.id"
              name="{{ depot.id }}"
              v-model="checkedDepot"
            />
            <label for="{{ depot.id }}"> {{ depot.csa_depot_name }}</label>
          </li>
        </ul>
        <UButton @click="updateDepot(checkedDepot)">update</UButton>
        <UButton @click="toggleDepotForm()">cancel</UButton>
      </form>
    </div>
  </div>
</template>
