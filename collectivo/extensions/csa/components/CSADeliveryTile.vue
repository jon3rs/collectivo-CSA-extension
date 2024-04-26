<script lang="ts" setup>
const props = defineProps({
  delivery: {
    type: [Object, Date] as PropType<
      csaDeliveryCycleException | csaShareOfMembershipException | Date
    >,
    required: true,
  },
  shareOfMembershipId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["refreshDeliveries"]);

const shareOfMembership: Ref<csaShareOfMembership> = ref(
  await getCSAShareOfMemberShipById(props.shareOfMembershipId)
);

const membership: Ref<csaMembership> = ref(
  await getCSAMembershipById(shareOfMembership.value.of_membership)
);

const membershipOwner: Ref<csaUser> = ref(
  await getUserByID(membership.value.csa_membership_of)
);

const defaultDepot: Ref<csaDepot> = ref(
  await getCSADepotById(shareOfMembership.value.default_depot)
);

const shareSize: Ref<csaShareSize> = ref(
  await getCSAShareSizeById(shareOfMembership.value.of_share_size)
);

const shareType: Ref<csaShareType> = ref(
  await getCSAShareTypeById(shareSize.value.of_type)
);

const getShareOfMembership = async () => {
  shareOfMembership.value = await getCSAShareOfMemberShipById(
    props.shareOfMembershipId
  );
};

const depotForm = ref(false);

const alternateDepot = ref("");

function toggleDepotForm() {
  depotForm.value = !depotForm.value;
}

const csaDepots: Ref<{ value: number; label: string }[]> = ref([]);

watch(depotForm, async (newForm) => {
  if (newForm) {
    csaDepots.value = await refreshDepots();
  }
});

async function refreshDepots(): Promise<{ value: number; label: string }[]>{
  return await getCSADepots().then((res) => {
    let altDepot = null;

    if (instanceOfCsaShareOfMembershipException(props.delivery)) {
      altDepot = props.delivery.alternate_depot;
    }

    return res.map((depot) => {
      console.log("defaultDepot", defaultDepot.value.id, depot.id, altDepot, depot.id == altDepot)
      return {
        value: depot.id,
        label: depot.csa_depot_name,
        disabled: defaultDepot.value.id == depot.id || altDepot == depot.id,
      };
    });
  })
}

//move to utils maybe?
async function addAlternateDepotException(depot: number) {
  console.log("addAlternateDepotException", depot, defaultDepot)

  if (
    props.shareOfMembershipId &&
    instanceOfCsaShareOfMembershipException(props.delivery)
  ) {
    if(depot == defaultDepot.value.id) {
      await deleteCsaShareOfMembershipException(
        props.delivery.id,
      );
    }else{
      await updateShareOfMembershipException(
      props.delivery.id,
      "alternate_depot",
      depot
    );
    }
    
  } else {
    await createShareOfMembershipException(
      props.shareOfMembershipId,
      getDeliveryDate(props.delivery),
      "alternate_depot",
      depot
    );
  }

  emit("refreshDeliveries");
  await getDepotName(depot);
  /*await getDepotName(depot); */
  toggleDepotForm();
}

async function suspendDelivery(){
  if(instanceOfCsaShareOfMembershipException(props.delivery) && props.delivery.csa_type_of_share_of_membership_exception == 'alternate_depot'){
    await updateShareOfMembershipException(props.delivery.id, 'suspended', null);
  }else if (instanceOfCsaDeliveryCycleException(props.delivery)){
    await createShareOfMembershipException(props.shareOfMembershipId, props.delivery.original_delivery_date, 'suspended');
  }else if(props.delivery instanceof Date && props.shareOfMembershipId) {
    await createShareOfMembershipException(props.shareOfMembershipId, props.delivery, 'suspended');
  }
  
  emit("refreshDeliveries");

}

async function deleteException(){
  try {
    await deleteCsaShareOfMembershipException(props.delivery.id);
    emit("refreshDeliveries");
  } catch (error) {
    console.error("deleteException", error);
  }
}

const alternateDepotName = ref("");

async function getDepotName(id: number) {
   await getCSADepotById(id).then((res) => {
    alternateDepotName.value = res.csa_depot_name;
    console.log("fetched alternateDepotName ", alternateDepotName.value, res);
});

  return alternateDepotName.value;
}

onMounted(async () => {
  getShareOfMembership();
  csaDepots.value = await refreshDepots();

  if(instanceOfCsaShareOfMembershipException(props.delivery) && props.delivery.csa_type_of_share_of_membership_exception == 'alternate_depot'){
    console.log("aalternateDepotName id", props.delivery)
    await getDepotName(props.delivery.alternate_depot);
  }

  console.log("alternateDepotName ", alternateDepotName);
  console.log("shareOfMembership", shareOfMembership.value.of_share_size);
});
</script>

<template>
  <div
    class="relative p-2 bg-white rounded my-2 -mx-4"
    :class="
      instanceOfCsaDeliveryCycleException(delivery) &&
      delivery.type_of_exception == 'cancelled' || instanceOfCsaShareOfMembershipException(delivery) && delivery.csa_type_of_share_of_membership_exception == 'suspended'
        ? 'text-slate-400 italic'
        : ''
    "
  >
    <div
      v-if="instanceOfCsaDeliveryCycleException(delivery)"
      class="absolute p-1 px-2 rounded-full bg-white border-solid border top-5 right-5"
      :class="{
        'text-red-500 border-red-500 not-italic':
          delivery.type_of_exception == 'cancelled',
        'text-green-500 border-green-500':
          delivery.type_of_exception == 'additional',
        'text-yellow-500 border-yellow-500':
          delivery.type_of_exception == 'postponed',
      }"
    >
      <p>{{ delivery.type_of_exception }}</p>
    </div>
    <div>
      <p>
        {{ shareType.csa_share_type_name }} {{ shareSize.csa_share_size_name }}
      </p>
    </div>
    <div class="flex items-center">
      <UIcon class="mr-3 text-xl" name="i-heroicons-calendar-days-solid" />
      <div>
        <p>
          am <strong> {{ formatDate(getDeliveryDate(delivery)) }}</strong>
        </p>
        <p>vrstl. <strong> Uhrzeit</strong></p>
      </div>
    </div>
    <div class="flex items-center mt-2">
      <UIcon class="mr-3 text-xl" name="i-heroicons-map-pin" />
      <div
        v-if="
          instanceOfCsaShareOfMembershipException(delivery) &&
          delivery.csa_type_of_share_of_membership_exception ==
            'alternate_depot'
        "
      >
       <span> gewechselt zu: {{ alternateDepotName }}</span> <UButton @click="deleteException()">zurücksetzen</UButton>

      </div>
      <div v-else>
        <p>{{ defaultDepot.csa_depot_name }}</p>
      </div>
    </div>
    <div
      v-if="
        !(
          instanceOfCsaDeliveryCycleException(delivery) &&
          delivery.type_of_exception == 'cancelled'
        )
      "
      class="mt-2"
    >
      <UButton @click="toggleDepotForm()">Depot wechseln</UButton>
      <UButton v-if="!(instanceOfCsaShareOfMembershipException(delivery) && delivery.csa_type_of_share_of_membership_exception == 'suspended')" @click="suspendDelivery()">aussetzen</UButton>
      <UButton v-else @click="deleteException()">zurücksetzen</UButton>
      <FormRadioGroup
        v-if="depotForm"
        v-model="alternateDepot"
        :options="csaDepots"
        @update="(n) => addAlternateDepotException(n)"
        @cancel="toggleDepotForm()"
      />
    </div>

    <p class="text-slate-400 text-xs italic my-2">
      membership #{{ membership.id }} of {{ membershipOwner.first_name }}
      {{ membershipOwner.last_name }}
    </p>
  </div>
</template>
