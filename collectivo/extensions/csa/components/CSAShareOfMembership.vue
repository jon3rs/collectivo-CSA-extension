<script setup lang="ts">
import { getCSARecurringShareInstances } from "@/composables/csaUtils";
import CSADeliveryListItem from "./CSADeliveryListItem.vue";

const props = defineProps({
  csaShare: {
    type: Number,
    required: true,
  },
});



onBeforeMount(() => {
  refreshShare().then(async (res) => {
    await refreshDepot();
    await refreshDeliveryCycles();
    shareSize.value = await getCSAShareSizeById(share.value.of_share_size);
    shareType.value = await getCSAShareTypeById(shareSize.value.of_type);
  });
});

onMounted(async() => {
  //await refreshDeliveryCycles();
  console.log("csaShare",props.csaShare)
});

const emit = defineEmits(["refreshDepot"]);

const share: Ref<csaShareOfMembership> = ref<csaShareOfMembership>(
  await getCSAShareOfMemberShipById(props.csaShare)
); //ref<csaShareOfMembership>();

const refreshShare = async () => {
  share.value = await getCSAShareOfMemberShipById(props.csaShare);
  return share.value;
};

const refreshDeliveryCycles = async () => {
  deliveryCycles.value = await getCSARecurringShareInstances(share.value)
};

//depot stuff
const shareSize: Ref<csaShareSize> = ref<csaShareSize>(
  await getCSAShareSizeById(share.value.of_share_size)
);

const shareType: Ref<csaShareType> = ref<csaShareType>(
  await getCSAShareTypeById(shareSize.value.of_type)
);

const depot: Ref<csaDepot | undefined> = ref(undefined);

const refreshDepot = async () => {
  depot.value = await getCSADepotById(share.value.default_depot).then((res) => {
    return res;
  });
};

const depotForm = ref(false);

const csaDepots: {value: number, label: string}[] = await getCSADepots().then((res) => {
  console.log("csaDepots", res)
  return res.map((depot) => {
    return {value: depot.id, label: depot.csa_depot_name};
  });
})

const checkedDepot = ref("");

function toggleDepotForm() {
  depotForm.value = !depotForm.value;
}

async function updateDepot(newDepot: number) {
  await updateDefaultDepot(props.csaShare, newDepot).then(() => {
    refreshShare().then(() => {
      refreshDepot();
      toggleDepotForm();
      checkedDepot.value = "";
    });
  });
}

//get delivery dates
const deliveryCycles: Ref<(csaDeliveryCycleWithDeliveries[]|undefined)> = ref(undefined);

</script>

<template>
  <div class="w-full">
    <div class="rounded-xl bg-white shadow-sidebar px-3 py-5">
      <p>the id of your share is {{ share.id }}</p>
      <div class="mt-2">
        <span class="inline-block font-bold mr-2">Typ:</span>
        <span>{{ shareType.csa_share_type_name }} {{ shareType.id }}</span> <br />
      </div>
      <div class="mt-2">
        <span class="inline-block font-bold mr-2">Größe:</span>
        <span>{{ shareSize.csa_share_size_name }}</span> <br />
      </div>
      <div class="mt-2 transition-all">
        <span class="inline-block font-bold mr-2">Default Depot:</span>
        <span v-if="depot">{{ depot.csa_depot_name }}</span>
        <UButton @click="toggleDepotForm()">switch default depot</UButton>
        <FormRadioGroup v-if="depotForm"  v-model="checkedDepot" :options="csaDepots" @cancel="toggleDepotForm()" @update="updateDepot($event)"/>
        <!-- <form
          v-if="depotForm == true"
          autocomplete="off"
          class="h-fit transition-all"
        >
          <p>Choose new default depot:</p>
          <ul>
            <li v-for="depot in csaDepots" :key="depot">
              <input
                v-model="checkedDepot"
                type="radio"
                :value="depot.id"
                name="{{ depot.id }}"
              />
              <label for="{{ depot.id }}"> {{ depot.csa_depot_name }}</label>
            </li>
          </ul>
          <UButton @click="updateDepot(checkedDepot)">update</UButton>
          <UButton @click="toggleDepotForm()">cancel</UButton>
        </form> -->
      </div>
    </div>
    <h3>scheduled deliveries for this share:</h3>
    <div v-if="deliveryCycles == undefined">
      <p>loading</p>
    </div>
    <div v-else-if="deliveryCycles.length == 0">
      <p>no deliveries scheduled yet</p>
    </div>
    <div v-else-if="deliveryCycles.length > 0">
      <div v-for="(deliveryCycle, index) in deliveryCycles" :key="index">
        <h3>{{ deliveryCycle.deliveryCycle.name_of_delivery_cycle }}</h3>
        <div v-if="deliveryCycle.deliveries.length == 0">
          <p>no deliveriessss scheduled yet</p>
        </div>
        <div v-else>
          juhuuu
          <div
            v-for="(delivery, index) in deliveryCycle.deliveries"
            :key="index"
          >
          <CSADeliveryListItem @refreshDeliveries="refreshDeliveryCycles()"  :index="index" :delivery="delivery" :shareOfMembershipId="csaShare"/>
            
          </div>
        </div>
      </div>
    </div>
    <!-- {{ deliveryCycles}} -->
    <!-- <CSARecurringShareInstance
      v-for="shareInstance in share.csa_recurring_share_instance"
      :key="shareInstance"
      :share-instance-id="shareInstance"
    /> -->
  </div>
</template>
