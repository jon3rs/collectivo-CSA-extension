<script setup lang="ts">
const memberships = ref<csaMembership[]>([]);

const refreshMemberships = async () => {
  memberships.value = await getCSAMembershipsOfCurrentUser();
};

onMounted(() => {
  refreshMemberships();
});
//await getCSAMembershipsOfCurrentUser();

async function requestMembership() {
  const user = await getCurrentUser();

  await addNewMembership(user).then((res) => {
    console.log("new membership: ", res);
    refreshMemberships();
  });
}

async function requestShare(memberId: number, size: number, depot: number) {
  await addShare(memberId, size, depot).then(() => {
    refreshMemberships();
  });
}

async function addShare(id: number, shareSizeId: number, depotId: number) {
  console.log("id: ", id);
  console.log("shareSizeId: ", shareSizeId);
  console.log("depotId: ", depotId);

  await addCSAShareToMembership(id, shareSizeId, depotId).then(async (res) => {
    console.log("now creating recurring share instances", res);

    await createRecurringShareInstancesFor(res.id).then(() => {
      console.log("created recurring share instances: ", res);
    });

    console.log("new share: ", res);
  });
}

const shareSizes = await getCSAShareSizes();
const shareTypes = await getCSAShareTypes();
const checkedSize = ref<number>();
const csaDepots = await getCSADepots();
const checkedDepot = ref("");
</script>

<template>
  <div>
    <h1>My Shares:</h1>
    <div
      v-if="memberships.length == 0"
      class="my-5 rounded-xl bg-white shadow-sidebar px-3 py-5 flex justify-between"
    >
      <p>
        You are not a member of any CSA. You first need to be member of a CSA in
        order to receive a share
      </p>
      <UButton @click="requestMembership()">request membership</UButton>
    </div>
    <div v-else>
      <div v-for="membership in memberships" :key="membership.id">
        <CSAMembership
          :csa-membership="membership"
          @refreshMemberships="refreshMemberships"
        />
        <div v-if="membership.csa_share_of_membership.length == 0">
          <p>you don't have any shares yet</p>
          <p class="font-bold">available Sharetypes:</p>
          <div v-for="shareType in shareTypes" :key="shareType.id" class="">
            <p class="font-bold">Anteilsart:</p>
            <span>{{ shareType.csa_share_type_name }}</span>
            <div class="my-3">
              <p>verfügbare Größen:</p>
              <ul>
                <li v-for="size in shareSizes" :key="size.id">
                  <input
                    id=""
                    v-model="checkedSize"
                    type="radio"
                    name="{{ size.id }}"
                    :value="size.id"
                  />
                  <label for="{{ size.id }}">{{
                    size.csa_share_size_name
                  }}</label>
                </li>
              </ul>
            </div>
            <div class="my-3">
              <p>Default Depot:</p>
              <ul>
                <li v-for="depot in csaDepots" :key="depot.id">
                  <input
                    v-model="checkedDepot"
                    type="radio"
                    :value="depot.id"
                    name="{{ depot.id }}"
                  />
                  <label for="{{ depot.id }}">
                    {{ depot.csa_depot_name }}</label
                  >
                </li>
              </ul>
            </div>
          </div>

          <UButton
            @click="requestShare(membership.id, checkedSize, checkedDepot)"
          >
            create share
          </UButton>
        </div>
        <div v-else class="flex">
          <div v-for="share in membership.csa_share_of_membership" :key="share">
            <CSAShareOfMembership
              :csa-share="share"
              @refreshDepot="refreshMemberships"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
