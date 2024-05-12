<script lang="ts" setup>
import { instanceOfCsaDeliveryCycleException, instanceOfCsaShareOfMembershipException } from '~/composables/csaUtils';

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

const csaDepots: {value: number, label: string}[]|undefined = !props.shareOfMembershipId ?  undefined : await getCSADepots().then(async (res) => {

  const defaultDepot = !props.shareOfMembershipId ?  '' : await getCSAShareOfMembershipById(props.shareOfMembershipId).then((res) => {
    return res.default_depot;
  });

  return res.map((depot) => {
    return {value: depot.id, label: depot.csa_depot_name, disabled: defaultDepot == depot.id};
  });
})

async function addAlternateDepotException(depot: number) {

  if(props.shareOfMembershipId && instanceOfCsaShareOfMembershipException(props.delivery) ) {
    await updateShareOfMembershipException(props.delivery.id, 'alternate_depot', depot );

  }else if(date instanceof Date && props.shareOfMembershipId) {
    await createShareOfMembershipException(props.shareOfMembershipId, date, 'alternate_depot', depot);
  }

  emit("refreshDeliveries");
  await getDepotName(depot);
  toggleDepotForm();
}

async function suspendDelivery(){
  if(instanceOfCsaShareOfMembershipException(props.delivery) && props.delivery.csa_type_of_share_of_membership_exception == 'alternate_depot'){
    await updateShareOfMembershipException(props.delivery.id, 'suspend', null);
  }else if(date instanceof Date && props.shareOfMembershipId) {
    await createShareOfMembershipException(props.shareOfMembershipId, date, 'suspend');
  }
  
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
      'bg-slate-200': delivery instanceof Date && index % 2 == 1,
      'bg-yellow-200':
        (instanceOfCsaDeliveryCycleException(delivery) &&
          delivery.type_of_exception == 'postponed') ||
        (instanceOfCsaShareOfMembershipException(delivery) &&
          delivery.csa_type_of_share_of_membership_exception ==
            'alternate_depot'),
      'bg-green-200':
        instanceOfCsaDeliveryCycleException(delivery) &&
        delivery.type_of_exception == 'additional',
      'bg-red-200':
        instanceOfCsaDeliveryCycleException(delivery) &&
        delivery.type_of_exception == 'cancelled',
    }"
  >
    <div>
      <div v-if="delivery instanceof Date">
        {{ formatDate(delivery) }}
      </div>
      <div v-else-if="instanceOfCsaDeliveryCycleException(delivery)">
        <span
          :class="{
            strikethrough:
              delivery.type_of_exception == 'postponed' ||
              delivery.type_of_exception == 'cancelled',
          }"
          >{{ formatDate(delivery.original_delivery_date) }}</span
        >
        <span
          v-if="
            delivery.type_of_exception == 'postponed' &&
            delivery.new_delivery_date
          "
        >
          → {{ formatDate(delivery.new_delivery_date) }}</span
        >
      </div>
      <span v-else-if="instanceOfCsaShareOfMembershipException(delivery)">
        {{ formatDate(delivery.date_of_share_exception) }}
      </span>
    </div>
    <div v-if="instanceOfCsaShareOfMembershipException(delivery)">
      <span
        v-if="
          delivery.csa_type_of_share_of_membership_exception ==
          'alternate_depot'
        "
      >
        →{{ alternateDepotName }}
      </span>
      <span v-else> delivery suspended</span>
      <UButton icon="i-heroicons-x-circle" @click="deleteException()" />
    </div>
    <div v-if="shareOfMembershipId">
      <UButton @click="toggleDepotForm()">Depot wechseln</UButton>
      <UButton @click="suspendDelivery()">aussetzen</UButton>
      <FormRadioGroup
        v-if="depotForm"
        v-model="alternateDepot"
        :options="csaDepots"
        @update="(n) => addAlternateDepotException(n)"
        @cancel="toggleDepotForm()"
      />
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
