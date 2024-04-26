<script setup lang="ts">
import type CSADeliveryListItem from '../CSADeliveryListItem.vue';

const user = useCollectivoUser();
const memberships: Ref<csaMembership[]> = ref(await getCSAMembershipsOfCurrentUser());
const membershipOwners: Ref<string[]> = ref([]);
const membershipShares: Ref<csaShareOfMembership[]> = ref([]);

const getMembershipOwners = async () =>{await Promise.all(memberships.value.map(async (membership) => {
  const membershipOwner = await getUserByID(membership.csa_membership_of);
  membershipOwners.value.push(membershipOwner.first_name + " " + membershipOwner.last_name);
}));};

const getMembershipShares = async () => {
  await Promise.all(memberships.value.map(async (membership) => {
    membershipShares.value = await getCSASharesOfMembership(membership.id);
  }));
}

const refreshMemberships = async () => {
  memberships.value = await getCSAMembershipsOfCurrentUser();
};

const deliveries: Ref<csaShareTile[]> = ref(await getNextDeliveries(5));

const  refreshDeliveries = async () =>{
  console.log("refreshingggg")
  deliveries.value = await getNextDeliveries(5);
  console.log("deliveriessss: ", deliveries)
}



onMounted(async () =>{
  getMembershipOwners();
  getMembershipShares();
  console.log("next Deliveries: ", deliveries)
})

</script>

<template>
  <div class="md:col-span-2">
    <div v-for="(delivery, index) in deliveries" :key="index">
      <CSADeliveryTile :delivery="delivery.delivery" :share-of-membership-id="delivery.of_share_of_membership" @refresh-deliveries="refreshDeliveries()" />
    </div>
    
  </div>
</template>
