<script lang="ts" setup>
const props = defineProps({
  delivery: {
    type: [Object, Date] as PropType<csaDeliveryCycleException| csaShareOfMembershipException | Date>,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  shareOfMembershipId: {
    type: Number,
    required: false,
  },
});

const emit = defineEmits(["refreshDeliveries"]);

const depotForm = ref(false);

const alternateDepot = ref("");

function toggleDepotForm() {
  depotForm.value = !depotForm.value;
}

const csaDepots: {value: number, label: string}[] = await getCSADepots().then(async (res) => {
  console.log(res);

  const defaultDepot = await getCSAShareOfMemberShipById(props.shareOfMembershipId).then((res) => {
    console.log("defaultDepot", res.default_depot)
    return res.default_depot;
  });

  return res.map((depot) => {
    console.log("depot", depot, defaultDepot)
    return {value: depot.id, label: depot.csa_depot_name, disabled: defaultDepot == depot.id};
  });
})

async function addAlternateDepotException(depot: number) {
  console.log("adding for depot!!", depot)
  
  if(props.delivery.csa_type_of_share_of_membership_exception && props.delivery.csa_type_of_share_of_membership_exception == 'alternate_depot'&& props.delivery.id) {
   console.log("updating")
    await updateAlternateDepotException(props.delivery.id, depot);
  }else if(date) {
    await createAlternateDepotException(props.shareOfMembershipId, date, depot);
  }

  toggleDepotForm();
  emit("refreshDeliveries");
  await getDepotName(depot);
}

async function suspendDelivery(){
  await createSuspendedDeliveryException(props.shareOfMembershipId, date);
  emit("refreshDeliveries");

}

async function deleteException() {
  await deleteCsaShareOfMembershipException(props.delivery.id);
  emit("refreshDeliveries");
}



async function getDepotName(id: number){
  const depot =  await getCSADepotById(id);
  alternateDepotName.value = depot.csa_depot_name;
}

const alternateDepotName = ref("");

onMounted(() => {
  if (props.delivery.csa_type_of_share_of_membership_exception && props.delivery.csa_type_of_share_of_membership_exception == 'alternate_depot') {
    getDepotName(props.delivery.alternate_depot);
  }

  if (props.delivery.alternate_depot)  {
    alternateDepot.value = props.delivery.alternate_depot;
  }
});

const date = props.delivery instanceof Date ? props.delivery : props.delivery.original_delivery_date;
</script>

<template>
  <div
    class="p-2 flex justify-between"
    :class="{
      'bg-slate-200': (delivery instanceof Date) && (index % 2 == 1),
      'bg-yellow-200': (!(delivery instanceof Date) && (delivery.type_of_exception == 'postponed'))|| (delivery.csa_type_of_share_of_membership_exception && delivery.csa_type_of_share_of_membership_exception == 'alternate_depot'),
      'bg-green-200': !(delivery instanceof Date) && (delivery.type_of_exception == 'additional'),
      'bg-red-200': !(delivery instanceof Date) && (delivery.type_of_exception == 'cancelled'),
    }"
  >
  <div>
    <span v-if="delivery instanceof Date">
      {{ formatDate(delivery) }}
    </span>
    <span v-else-if="delivery.type_of_exception">
      <span
        :class="{
          strikethrough:
            delivery.type_of_exception == 'postponed' ||
            delivery.type_of_exception == 'cancelled',
        }"
        >{{ formatDate(delivery.original_delivery_date) }}</span
      >
      <span v-if="delivery.type_of_exception == 'postponed' && delivery.new_delivery_date">
        → {{ formatDate(delivery.new_delivery_date) }}</span
      >
    </span>
    <span v-else-if="delivery.csa_type_of_share_of_membership_exception"> 
      {{ formatDate(delivery.date_of_share_exception) }}
    </span>
  </div>
  <div v-if="delivery.csa_type_of_share_of_membership_exception">
    <span v-if="delivery.csa_type_of_share_of_membership_exception == 'alternate_depot'">
      →{{ alternateDepotName }}
    </span>
    <span v-else> delivery suspended</span>
    <UButton icon="i-heroicons-x-circle" @click="deleteException()" />
  </div>
    <div v-if="shareOfMembershipId"> 
      <UButton @click="toggleDepotForm()">Depot wechseln</UButton>
      <UButton @click="suspendDelivery()">aussetzen</UButton>
      <FormRadioGroup v-if="depotForm" v-model="alternateDepot" :options="csaDepots"  @update="(n) => addAlternateDepotException(n)" @cancel="toggleDepotForm()"/>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.strikethrough {
  text-decoration: line-through;
}

.delivery-list-item {
  @apply bg-slate-200;
}
</style>
