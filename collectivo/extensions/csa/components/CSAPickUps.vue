<script setup lang="ts">
const props = defineProps({
    pickUps: {
        type: Array as PropType<(csaShareOfMembership | csaShareOfMembershipException)[]>,
        required: true
    },
    depotId: {
        type: Number ,
        required: true
    }
})

const actualPickUps: Ref<number> = ref(0);
const cancelledPickUps: Ref<number> = ref(0);
const incomingPickUps: Ref<number> = ref(0);
const outgoingPickUps: Ref<number> = ref(0);

onMounted(()=>{

    props.pickUps.forEach((pickUp)=>{
        if(instanceOfCsaShareOfMembershipException(pickUp)){
            if(pickUp.csa_type_of_share_of_membership_exception === 'alternate_depot'){
                if(pickUp.alternate_depot === props.depotId){
                    incomingPickUps.value++;
                    actualPickUps.value++;
                }else{
                    outgoingPickUps.value++;
                }
            }else if(pickUp.csa_type_of_share_of_membership_exception === 'suspend'){
                cancelledPickUps.value++;
            }
        }else if(instanceOfCsaShareOfMembership(pickUp)){
            actualPickUps.value++;
        }
    })
})

</script>

<template>
<div class="flex items-center">
    <div> <p> {{ actualPickUps }}</p></div>
    <div class="variance ml-2">
        <p v-if="cancelledPickUps != 0"><UIcon name="i-heroicons-no-symbol"/> {{ cancelledPickUps }}</p>
        <p v-if="outgoingPickUps != 0"><UIcon name="i-heroicons-arrow-right"/> {{ outgoingPickUps }}</p>
        <p v-if="incomingPickUps != 0" class="text-green-600"><UIcon name="i-heroicons-arrow-left"/> {{ incomingPickUps }}</p>
    </div>
</div>
</template>

<style scoped lang="scss">
.variance{
    @apply block text-red-600  text-right;
    p{
        @apply mb-0 leading-4 flex items-center;
        font-size: .75rem;

    }
}
</style>