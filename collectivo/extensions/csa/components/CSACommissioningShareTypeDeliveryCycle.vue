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

const gridClasses: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",

}

const grid = computed(() => {
  return gridClasses[shareSizes.value.length + 1];
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
      const pickUpsPerDepotIndex = pickUpsPerDepot.value.findIndex(
        (pickUp) =>
          pickUp.depot.id === incoming.exception.alternate_depot &&
          pickUp.shareSize.id === incoming.shareSize.id
      );

      pickUpsPerDepot.value[pickUpsPerDepotIndex].pickUps.push(
        incoming.exception
      );
      
    });
  } 
}

function getPickUps(depotId: number, shareSizeId: number) {
  const pickUpsIndex = pickUpsPerDepot.value.findIndex(
    (pickUp) =>
      pickUp.depot.id === depotId && pickUp.shareSize.id === shareSizeId
  );
  
  return pickUpsPerDepot.value[pickUpsIndex].pickUps;
}



onMounted(async () => {
  await getNextDelivery();
  await getShareSizes();
  await getPickUpsPerDepot();
  console.log("finished fetching data", fetchingData.value)
  fetchingData.value = false;
});
</script>

<template>
  <div v-if="!fetchingData">
    nächste Lieferung vom Lieferzyklus
    {{ deliveryCycle.name_of_delivery_cycle }} am
    {{ formatDate(nextDelivery) }}:
    <div >
      <div :class="` depotRows grid gap-5 ${grid}`"   >
        <div>Größe</div>
        <div v-for="shareSize in shareSizes" :key="shareSize.id">
          {{ shareSize.csa_share_size_name }}
        </div>
      </div>
      <div
        v-for="depot in csaDepots"
        :key="depot.id"
        :class="` depotRows grid gap-5 ${grid}`" 
      >
        <div>{{ depot.csa_depot_name }}</div>
        <div v-for="shareSize in shareSizes" :key="shareSize.id">
            <CSAPickUps
              v-if="!fetchingData "
              :pickUps="getPickUps(depot.id, shareSize.id) "
              :depotId="depot.id"
            />
            <div v-else>still fetching</div>
        </div>
      </div>
      <hr />
      <div :class="`depotRows grid gap-5 ${grid}`">
        <div>gesamt:</div>
        <div v-for="shareSize in shareSizes" :key="shareSize.id">
          0
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