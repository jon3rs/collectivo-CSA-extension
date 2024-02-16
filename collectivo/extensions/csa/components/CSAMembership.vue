<script setup lang="ts">
const props = defineProps({
  csaMembership: {
    type: Object as PropType<csaMembership>,
    required: true,
  },
});

const emit = defineEmits(["refreshMemberships"]);

const membershipOwner = await getUserByID(
  props.csaMembership.csa_membership_of
);

async function deleteMembership(id: number) {
  await deleteCSAMembership(id).then(() => {
    emit("refreshMemberships");
  });
}
</script>

<template>
  <div class="container">
    <h2 class="mr-4">
      Mitgliedschaft von {{ membershipOwner.first_name }}
      {{ membershipOwner.last_name }}
    </h2>

    <UButton @click="deleteMembership(csaMembership.id)">
      delete Membership
    </UButton>
  </div>
</template>

<style scoped lang="scss">
.container {
  @apply my-5 rounded-xl bg-white shadow-sidebar px-3 py-5 flex w-full;
}
</style>
