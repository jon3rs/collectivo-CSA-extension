<script setup lang="ts">
import {readItem} from '@directus/sdk';

const props = defineProps({
    shareType: {
        type: Object as PropType<csaShareType>,
        required: true,
    },
});

const directus = useDirectus();

const deliveryCycles: Ref<csaDeliveryCycle[]> = ref([]);

async function getDeliveryCycles(){
deliveryCycles.value = [];

    await Promise.all(props.shareType.delivered_on.map(async (junctionRowId) => {
        const junction = await directus.request(readItem('csa_share_type_csa_delivery_cycle',junctionRowId));
        const deliveryCycleId = junction.csa_delivery_cycle_id;
        const deliveryCycle = await getCsaDeliveryCycleById(deliveryCycleId);
        deliveryCycles.value.push(deliveryCycle);
    }));
}



onMounted(() => {
    getDeliveryCycles()
})

</script>

<template>
    <div>
        <h5>{{ shareType.csa_share_type_name }}</h5>
        <div v-for="deliveryCycle in deliveryCycles" :key="deliveryCycle.id">
            <CSACommissioningShareTypeDeliveryCycle :delivery-cycle="deliveryCycle" :share-type="shareType"/>
        </div>
    </div>
</template>