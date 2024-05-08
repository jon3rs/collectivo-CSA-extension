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
const pickUpsPerDepot: Ref<{csaDepot, csaShareSize, number}[]> = ref([]);
const exceptionsPerDepot: Ref<{csaDepot, csaShareSize, number}[]> = ref([]);
const variancePerDepot: Ref<{csaDepot, csaShareSize, number}[]> = ref([]);

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
  nextDelivery.value = nextDeliveryCycle;
}

async function getPickUpsPerDepot() {

    await Promise.all(
    csaDepots.value.map(async (depot) => {

      await Promise.all(
        shareSizes.value.map(async (shareSize) => {
          const pickUps = await getDefaultPickUpsAmount(shareSize.id, depot.id);

          pickUpsPerDepot.value.push({
            depot: depot,
            shareSize: shareSize,
            pickUps: pickUps,
          });
        })
      );
    })
  );

  pickUpsPerDepot.value.forEach((pickUp) => {
    console.log("looking for matches: ", pickUp.depot.csa_depot_name, pickUp.shareSize.csa_share_size_name, pickUp.pickUps)
    const exceptions = exceptionsPerDepot.value.find((exceptions) => exceptions.depot.id === pickUp.depot.id && exceptions.shareSize.id === pickUp.shareSize.id);
    console.log("exxx",exceptions);

    if(exceptions){
        console.log("found exceptions: ", exceptions.depot.csa_depot_name, exceptions.shareSize.csa_share_size_name, exceptions.exceptions.length)
        
        if(!variancePerDepot.value.find((variance) => variance.depot.id === exceptions.depot && variance.shareSize.id === exceptions.shareSize)){
            variancePerDepot.value.push({
                depot: exceptions.depot,
                shareSize: exceptions.shareSize,
                variance: -exceptions.exceptions.length,
            });
        }else{
            variancePerDepot.value.find((variance) => variance.depot.id === exceptions.depot && variance.shareSize.id === exceptions.shareSize).variance -= exceptions.exceptions.length;
        
        }

        exceptions.exceptions.forEach((exception) => {
            if(exception.csa_type_of_share_of_membership_exception == 'alternate_depot'){
                //update corresponding variancePerDepot
                if(variancePerDepot.value.find((variance) => variance.depot.id === exception.alternate_depot && variance.shareSize.id === exception.csa_share_size)){
                    variancePerDepot.value.find((variance) => variance.depot.id === exception.alternate_depot && variance.shareSize.id === exception.csa_share_size).variance += 1;
                }else{
                    variancePerDepot.value.push({
                        depot: exception.alternate_depot,
                        shareSize: exception.csa_share_size,
                        variance: 1,
                    })
                }
            }
            console.log("exception: ", exception);
        })

        pickUp.pickUps -= exceptions.exceptions.length;
    }
  })
}

async function getExceptionsPerDepot() {
    await Promise.all(
        csaDepots.value.map(async (depot) => {
        await Promise.all(
            shareSizes.value.map(async (shareSize) => {
            const exceptions = await getRecurringShareInstanceExceptionsByShareSize(shareSize.id, nextDelivery.value[0], depot.id);
            
            exceptionsPerDepot.value.push({
                depot: depot,
                shareSize: shareSize,
                exceptions: exceptions,
            });
            })
        );
        })
    );
}

function getPickUpsAmount(depotId: number, shareSizeId: number){
    const pickUps = pickUpsPerDepot.value.find(pickUp => pickUp.depot.id === depotId && pickUp.shareSize.id === shareSizeId);
    return pickUps ? pickUps.pickUps : 0;
}

onMounted(async () => {
  await getNextDelivery();
  await getShareSizes();
  await getExceptionsPerDepot();
  await getPickUpsPerDepot();
  console.log("PickUpsPerDepot: ", pickUpsPerDepot);
  exceptionsPerDepot.value.forEach((exception) => {
    console.log("ExceptionsPerDepot: ", exception.depot.csa_depot_name, exception.shareSize.csa_share_size_name, exception.exceptions.length);
  })
    console.log("ExceptionsPerDepot: ", exceptionsPerDepot.value);
});
</script>

<template>
  <div>
    nächste Lieferung vom Lieferzyklus
    {{ deliveryCycle.name_of_delivery_cycle }} am
    {{ formatDate(nextDelivery) }}:
    <div class="">
      <div class="grid grid-cols-3 gap-3">
        <div>Größe</div>
        <div v-for="shareSize in shareSizes" :key="shareSize.id">
          {{ shareSize.csa_share_size_name }}
        </div>
      </div>
      <div
        v-for="depot in csaDepots"
        :key="depot.id"
        class="grid grid-cols-3 gap-3"
      >
        <div>{{ depot.csa_depot_name }}</div>
        <div v-for="shareSize in shareSizes" :key="shareSize.id">
            {{ getPickUpsAmount(depot.id, shareSize.id) }} <span class="text-red-700" v-if="variancePerDepot.find((variance) => variance.depot.id === depot.id && variance.shareSize.id === shareSize.id)"> {{ variancePerDepot.find((variance) => variance.depot.id === depot.id && variance.shareSize.id === shareSize.id).variance }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
