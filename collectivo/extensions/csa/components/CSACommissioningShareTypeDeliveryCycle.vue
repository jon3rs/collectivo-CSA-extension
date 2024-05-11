<script setup lang="ts">
const props = defineProps({
  deliveryCycle: {
    type: Object as PropType<csaDeliveryCycle>,
    required: true,
  },
  shareType: {
    type: Object as PropType<csaShareType>,
    required: true,
  },
});

const nextDelivery: Ref<Date | csaDeliveryCycleException | null> = ref(null);
const csaDepots: Ref<csaDepot[]> = ref(await getCSADepots());
const shareSizes: Ref<csaShareSize[]> = ref([]);
const fetchingData: Ref<boolean> = ref(true);

const grid = computed(() => {

  return `grid grid-cols-${shareSizes.value.length + 1} gap-5`
})

const pickUpsPerDepot: Ref<
  {
    depot: csaDepot;
    shareSize: csaShareSize;
    pickUps: (csaShareOfMembership | csaShareOfMembershipException)[];
  }[]
> = ref([]);


async function getShareSizes() {
  shareSizes.value = [];

  await Promise.all(
    props.shareType.csa_share_size.map(async (shareSizeId) => {
      const shareSize = await getCSAShareSizeById(shareSizeId);
      shareSizes.value.push(shareSize);
    })
  );
}

async function getNextDelivery() {
  const nextDeliveryCycle = await getDeliveryCycleActualDeliveries(
    props.deliveryCycle,
    1,
    0,
    new Date()
  );

  //what if nextDelivery is exception? →extract Date here already?
  nextDelivery.value = Array.isArray(nextDeliveryCycle)
    ? nextDeliveryCycle[0]
    : nextDeliveryCycle;
}


async function getPickUpsPerDepot() {
  if (nextDelivery.value != null) {
    const nextDeliveryDate = nextDelivery.value;
    
    const incomings: {
      shareSize: csaShareSize;
      exception: csaShareOfMembershipException;
    }[] = [];

    await Promise.all(
      csaDepots.value.map(async (depot) => {
        await Promise.all(
          shareSizes.value.map(async (shareSize) => {
            const pickUps = await getDefaultPickUpsOfDepotAndShareSize(
              shareSize.id,
              depot.id
            );

            await Promise.all(
              pickUps.map(
                async (
                  shareOfMembership: csaShareOfMembership,
                  index: number
                ) => {
                  const exceptions = await getShareOfMembershipExceptionForDate(
                    shareOfMembership.id,
                    getUTCDate(nextDeliveryDate)
                  );

                  if (exceptions && exceptions.length > 0) {
                    pickUps[index] = exceptions[0];

                    if (
                      exceptions[0].csa_type_of_share_of_membership_exception ==
                      "alternate_depot"
                    ) {
                      incomings.push({ shareSize, exception: exceptions[0] });
                    }
                  }
                }
              )
            );

            pickUpsPerDepot.value.push({
              depot: depot,
              shareSize: shareSize,
              pickUps: pickUps,
            });
          })
        );
      })
    );

    incomings.forEach((incoming) => {
      pickUpsPerDepot.value
        .find(
          (pickUp) =>
            pickUp.depot.id === incoming.exception.alternate_depot &&
            pickUp.shareSize.id === incoming.shareSize.id
        )
        .pickUps.push(incoming.exception);
    });
  } else {
    console.log("nextDelivery is null", nextDelivery.value);
  }
}


function hasCancelledPickUps(depotId: number, shareSizeId: number) {
  console.log("looking for cancelled", pickUpsPerDepot.value);
  let cancelledPickUps: csaShareOfMembershipException[] = [];
  if (fetchingData.value) return cancelledPickUps;

  if (pickUpsPerDepot.value != undefined) {
    const relevantPickUps = pickUpsPerDepot.value.find(
      (pickUps) =>
        pickUps.depot.id === depotId && pickUps.shareSize.id === shareSizeId
    );

    cancelledPickUps = relevantPickUps
      ? relevantPickUps.pickUps.find(
          (pickUp) =>
            instanceOfCsaShareOfMembershipException(pickUp) &&
            pickUp.csa_type_of_share_of_membership_exception == "cancelled"
        )
      : [];
  }

  console.log("cancelledPickUps", cancelledPickUps);
  return cancelledPickUps;
}

onMounted(async () => {
  await getNextDelivery();
  await getShareSizes();
  //await getSharesOfMemberships();
  await getPickUpsPerDepot();
  console.log("setting fetchingData to false", shareSizes.value, grid.value)
  fetchingData.value = false;
});
</script>

<template>
  <div>
    nächste Lieferung vom Lieferzyklus
    {{ deliveryCycle.name_of_delivery_cycle }} am
    {{ formatDate(nextDelivery) }}:
    <div v-if="!fetchingData">
      <div :class="`mb-3  ${grid}`" >
        <div>Größe</div>
        <div v-for="shareSize in shareSizes" :key="shareSize.id">
          {{ shareSize.csa_share_size_name }}
        </div>
      </div>
      <div
        v-for="depot in csaDepots"
        :key="depot.id"
        :class="`mb-3 depotRows ${grid}`" 
      >
        <div>{{ depot.csa_depot_name }}</div>
        <div v-for="shareSize in shareSizes" :key="shareSize.id">
            <CSAPickUps
              v-if="!fetchingData"
              :pickUps="
                pickUpsPerDepot.find(
                  (pickUp) =>
                    pickUp.depot.id === depot.id &&
                    pickUp.shareSize.id === shareSize.id
                ).pickUps
              "
              :depotId="depot.id"
            />
            <div v-else>still fetching</div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
.depotRows:nth-child(even){
  @apply bg-white;
}
</style>